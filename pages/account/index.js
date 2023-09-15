/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../fresns';
import { fresnsLogin } from '../../utils/fresnsLogin';
import { fresnsConfig, fresnsLang, fresnsAccount, fresnsUser, fresnsUserPanel } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';
import { cachePut, cacheGet } from '../../utils/fresnsUtilities';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/globalConfig'), require('../../mixins/fresnsExtensions')],

  /** 页面的初始数据 **/
  data: {
    loadingStatus: false,

    accountLogin: false,
    userLogin: false,

    showLangActionSheet: false,
    langGroups: [],

    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,
    fresnsUser: null,
    fresnsUserPanel: null,

    showLogoutDialog: false,
    loginButtons: [],

    // 多端应用 Android 升级
    downloadApk: false,
    downloadProgress: 0, // 下载进度
    downloadTotalWritten: '', // 已经下载的数据长度
    downloadTotalExpectedToWrite: '', // 预期需要下载的数据总长度
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account'),
    });

    const langArr = await fresnsConfig('language_menus');

    const langGroups = langArr
      .filter((item) => item.isEnabled)
      .map((item) => {
        let text = item.langName;
        if (item.areaName) {
          text = item.langName + ' (' + item.areaName + ')';
        }

        const newItem = {
          text: text,
          value: item.langTag,
        };

        if (item.langTag === globalInfo.langTag) {
          newItem.type = 'warn';
        }

        return newItem;
      });

    this.setData({
      accountLogin: globalInfo.accountLogin,
      userLogin: globalInfo.userLogin,
      fresnsConfig: await fresnsConfig(),
      fresnsLang: await fresnsLang(),
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsUserPanel: await fresnsUserPanel(),
      langGroups: langGroups,
      loginButtons: [
        {
          text: await fresnsLang('cancel'),
        },
        {
          text: await fresnsLang('confirm'),
          extClass: 'warn',
        },
      ],
    });
  },

  /** 监听页面渲染完成 **/
  onReady: async function () {
    const appInfo = wx.getStorageSync('appInfo');

    if (appInfo.isWechat) {
      return;
    }

    const timestamp = Date.now();

    wx.request({
      url: appConfig.apiHost + '/app/version.json?time=' + timestamp,
      enableHttp2: true,
      success: async (res) => {
        if (res.statusCode !== 200) {
          return;
        }

        const versionInfo = res.data[appInfo.platform];

        console.log('Auto Check Version', versionInfo?.version, globalInfo.clientVersion);

        if (versionInfo?.version == globalInfo.clientVersion) {
          appInfo.hasNewVersion = false;
          this.setData({
            appInfo: appInfo,
          });
          wx.setStorageSync('appInfo', appInfo);

          return;
        }

        appInfo.hasNewVersion = true;
        appInfo.apkUrl = versionInfo?.apkUrl;
        this.setData({
          appInfo: appInfo,
        });
        wx.setStorageSync('appInfo', appInfo);
      },
    });
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    console.log('reload data start');

    wx.showNavigationBarLoading();
    this.setData({
      loadingStatus: true,
    });

    wx.removeStorageSync('fresnsAccount');
    wx.removeStorageSync('fresnsUser');
    wx.removeStorageSync('fresnsUserPanels');

    this.setData({
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsUserPanel: await fresnsUserPanel(),
    });

    wx.stopPullDownRefresh({
      complete: () => {
        wx.hideNavigationBarLoading();
        this.setData({
          loadingStatus: false,
        });
        console.log('reload data end');
      },
    });
  },

  // 修改通知消息数
  onChangeUnreadNotifications: function () {
    console.log('onChangeUnreadNotifications account');

    const fresnsUserPanel = this.data.fresnsUserPanel;
    const newCount = fresnsUserPanel.unreadNotifications.all - 1;

    fresnsUserPanel.unreadNotifications.all = newCount;

    this.setData({
      fresnsUserPanel: fresnsUserPanel,
    });
  },

  // 修改私信消息数
  onChangeUnreadMessages: function (count = 1) {
    console.log('onChangeUnreadMessages account', count);

    const fresnsUserPanel = this.data.fresnsUserPanel;
    const newCount = fresnsUserPanel.conversations.unreadMessages - count;

    fresnsUserPanel.conversations.unreadMessages = newCount;

    this.setData({
      fresnsUserPanel: fresnsUserPanel,
    });
  },

  /** 切换语言菜单 **/
  showLanguageSheet: function (e) {
    this.setData({
      showLangActionSheet: true,
    });
  },

  /** 切换语言操作 **/
  langBtnClick: function (e) {
    wx.setStorageSync('langTag', e.detail.value);

    this.setData({
      showLangActionSheet: false,
    });

    wx.redirectTo({
      url: '/pages/account/index',
    });
  },

  /** 检测版本 **/
  onCheckVersion: async function (e) {
    wx.showToast({
      title: await fresnsLang('inProgress'),
      icon: 'none',
    });

    const timestamp = Date.now();

    wx.request({
      url: appConfig.apiHost + '/app/version.json?time=' + timestamp,
      enableHttp2: true,
      success: async (res) => {
        if (res.statusCode !== 200) {
          return;
        }

        const appInfo = this.data.appInfo;
        const versionInfo = res.data[appInfo.platform];

        console.log('onCheckVersion', versionInfo?.version, globalInfo.clientVersion);

        if (versionInfo?.version == globalInfo.clientVersion) {
          wx.showToast({
            title: await fresnsLang('isLatestVersion'),
            icon: 'none',
          });

          return;
        }

        appInfo.hasNewVersion = true;
        appInfo.apkUrl = versionInfo?.apkUrl;
        this.setData({
          appInfo: appInfo,
        });
        wx.setStorageSync('appInfo', appInfo);
      },
    });
  },

  /** 升级 **/
  onUpdateApp: async function (e) {
    const updateAppFilePath = cacheGet('updateAppFilePath');
    console.log('updateAppFilePath', updateAppFilePath);
    if (updateAppFilePath) {
      // 安装升级包
      wx.miniapp.installApp({
        filePath: updateAppFilePath,
        success: (res) => {
          console.log('install app success', res);

          this.setData({
            downloadApk: false,
          });
        },
        fail: (res) => {
          wx.showToast({
            title: '[' + res.errCode + '] ' + res.errMsg,
            icon: 'none',
          });
          console.log('install app fail', res);

          this.setData({
            downloadApk: false,
          });
        },
      });

      return;
    }

    const downloadApk = this.data.downloadApk;
    console.log('downloadApk', downloadApk);
    if (downloadApk) {
      return;
    }

    const appInfo = this.data.appInfo;

    switch (appInfo.platform) {
      case 'ios':
        wx.miniapp.jumpToAppStore({
          success: (res) => {
            console.log('jumpToAppStore success:', res);
          },
          fail: (res) => {
            wx.showToast({
              title: '[' + res.errCode + '] ' + res.errMsg,
              icon: 'none',
            });
            console.log('jumpToAppStore fail:', res);
          },
        });
        break;

      case 'android':
        console.log(appInfo.apkUrl);

        const downloadTask = wx.downloadFile({
          url: appInfo.apkUrl,
          timeout: 600000,
          success: (res) => {
            console.log('download apk success', res);

            this.setData({
              downloadApk: false,
            });
            cachePut('updateAppFilePath', res.tempFilePath, 1);

            // 安装升级包
            wx.miniapp.installApp({
              filePath: res.tempFilePath,
              success: (res) => {
                console.log('install app success', res);

                this.setData({
                  downloadApk: false,
                });
              },
              fail: (res) => {
                wx.showToast({
                  title: '[' + res.errCode + '] ' + res.errMsg,
                  icon: 'none',
                });
                console.log('install app fail', res);

                this.setData({
                  downloadApk: false,
                });
              },
            });
          },
          fail: (res) => {
            wx.showToast({
              title: '[' + res.errCode + '] ' + res.errMsg,
              icon: 'none',
            });
            console.log('download apk fail', res);

            this.setData({
              downloadApk: false,
            });
            wx.removeStorageSync('updateAppFilePath');
          },
        });

        downloadTask.onProgressUpdate((res) => {
          let totalWritten = res.totalBytesWritten / 1024 / 1024;
          let totalExpectedToWrite = res.totalBytesExpectedToWrite / 1024 / 1024;

          this.setData({
            downloadApk: true,
            downloadProgress: res.progress, // 下载进度
            downloadTotalWritten: parseFloat(totalWritten.toFixed(2)), // 已经下载的数据长度
            downloadTotalExpectedToWrite: parseFloat(totalExpectedToWrite.toFixed(2)), // 预期需要下载的数据总长度
          });
        });
        break;

      case 'devtools':
        wx.showToast({
          title: 'devtools',
          icon: 'none',
        });
        break;

      default:
        return;
    }
  },

  /** 退出登录 **/
  onClickLogout: function () {
    this.setData({
      showLogoutDialog: true,
    });
  },

  /** 确认退出登录 **/
  onConfirmLogout: async function (e) {
    console.log(e);

    if (e.detail.index === 1) {
      await fresnsLogin.logout();

      this.setData({
        accountLogin: false,
        userLogin: false,

        fresnsAccount: null,
        fresnsUser: null,
        fresnsUserPanel: null,
      });
    }

    this.setData({
      showLogoutDialog: false,
    });
  },
});
