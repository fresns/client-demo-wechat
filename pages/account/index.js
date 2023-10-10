/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsLogin } from '../../utils/fresnsLogin';
import { fresnsConfig, fresnsLang, fresnsAccount, fresnsUser, fresnsUserPanel } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';
import { cachePut, cacheGet, versionCompare } from '../../utils/fresnsUtilities';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/globalConfig'), require('../../mixins/fresnsExtensions')],

  /** 页面的初始数据 **/
  data: {
    showPrivacy: false,

    title: null,
    logo: null,
    appInfo: {},
    clientInfo: {},

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

    userHomePath: '',
    userExtcredits: false,

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
      title: await fresnsConfig('menu_account'),
      logo: await fresnsConfig('site_logo'),
      appInfo: wx.getStorageSync('appInfo'),
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
      userHomePath: await globalInfo.userHomePath(),
    });
  },

  /** 监听页面渲染完成 **/
  onReady: async function () {
    const appInfo = wx.getStorageSync('appInfo');

    // appInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    if (appInfo.isWechat) {
      const fresnsStatus = await fresnsApi.global.globalStatus();
      const clientInfo = fresnsStatus?.client?.mobile[appInfo.platform];

      this.setData({
        clientInfo: clientInfo,
      });

      return;
    }

    const fresnsStatus = await fresnsApi.global.globalStatus();
    const clientInfo = fresnsStatus?.client?.mobile[appInfo.platform];
    const checkVersion = versionCompare(globalInfo.clientVersion, clientInfo?.version);

    console.log('Auto Check Version', globalInfo.clientVersion, clientInfo?.version, checkVersion);

    if (clientInfo?.version == globalInfo.clientVersion || checkVersion != -1) {
      appInfo.hasNewVersion = false;
      this.setData({
        appInfo: appInfo,
      });
      wx.setStorageSync('appInfo', appInfo);

      return;
    }

    appInfo.hasNewVersion = true;
    appInfo.apkUrl = clientInfo?.downloads?.apk;
    this.setData({
      appInfo: appInfo,
    });
    wx.setStorageSync('appInfo', appInfo);
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    // 防抖判断
    if (isRefreshing) {
      wx.stopPullDownRefresh();
      return;
    }

    isRefreshing = true;

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
      },
    });

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  // 展开用户积分
  onClickExtcredits: function () {
    this.setData({
      userExtcredits: !this.data.userExtcredits,
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

  /** 下载应用 **/
  onDownloadApp: function (e) {
    // 判断隐私授权
    if (wx.canIUse('getPrivacySetting')) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            this.setData({
              showPrivacy: true,
            });
          }
        },
      });
    }

    const fresnsLang = this.data.fresnsLang;
    const appInfo = this.data.appInfo;
    const clientInfo = this.data.clientInfo;

    // appInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    let title;
    let content;

    switch (appInfo.platform) {
      case 'ios':
        title = 'iOS App';
        content = clientInfo.appStore;
        break;

      case 'android':
        title = 'Android App';
        content = clientInfo.downloads.apk;

        // 处理 Google Play 选项
        if (clientInfo.googlePlay) {
          const downloadApk = fresnsLang.downloadApp + ' (apk)';
          wx.showActionSheet({
            itemList: ['Google Play', downloadApk],
            success(res) {
              if (res.tapIndex == 0) {
                content = clientInfo.googlePlay;
              }

              wx.showModal({
                title: title,
                content: content,
                cancelText: fresnsLang.cancel,
                confirmText: fresnsLang.copyLink,
                success(res) {
                  if (res.confirm) {
                    wx.setClipboardData({
                      data: content,
                      success: function (res) {
                        wx.showToast({
                          title: fresnsLang.copySuccess,
                        });
                      },
                    });
                  }
                },
              });

              // 处理结束
            },
          });

          return;
        }
        break;

      case 'devtools':
        title = 'devtools';
        content = 'devtools';
        break;

      default:
        return;
    }

    wx.showModal({
      title: title,
      content: content,
      cancelText: fresnsLang.cancel,
      confirmText: fresnsLang.copyLink,
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: content,
            success: function (res) {
              wx.showToast({
                title: fresnsLang.copySuccess,
              });
            },
          });
        }
      },
    });
  },

  /** 检测版本 **/
  onCheckVersion: async function (e) {
    wx.showToast({
      title: await fresnsLang('inProgress'),
      icon: 'none',
    });

    const appInfo = wx.getStorageSync('appInfo');

    // appInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    const fresnsStatus = await fresnsApi.global.globalStatus();
    const clientInfo = fresnsStatus?.client?.mobile[appInfo.platform];
    const checkVersion = versionCompare(globalInfo.clientVersion, clientInfo?.version);

    console.log('checkVersion', globalInfo.clientVersion, clientInfo?.version, checkVersion);

    if (clientInfo?.version == globalInfo.clientVersion || checkVersion != -1) {
      wx.showToast({
        title: await fresnsLang('isLatestVersion'),
        icon: 'none',
      });

      return;
    }

    appInfo.hasNewVersion = true;
    appInfo.apkUrl = clientInfo?.downloads?.apk;
    this.setData({
      appInfo: appInfo,
    });
    wx.setStorageSync('appInfo', appInfo);
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
