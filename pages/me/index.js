/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { switchLangTag, fresnsClient } from '../../sdk/helpers/client';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsLogin } from '../../sdk/helpers/login';
import { fresnsAuth, fresnsAccount, fresnsUser, fresnsOverview, fresnsViewProfilePath } from '../../sdk/helpers/profiles';
import { cachePut, cacheGet, clearCache } from '../../sdk/helpers/cache';
import { versionCompare } from '../../sdk/utilities/toolkit';

let isRefreshing = false; // 下拉刷新防抖参数

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,

    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,
    fresnsUser: null,
    fresnsOverview: null,

    accountLogin: false,
    userLogin: false,

    accountLoginService: null,
    enableWeChatLogin: true,

    loginBtnText: null,

    refresherStatus: false, // scroll-view 视图容器下拉刷新状态

    appBaseInfo: {},
    clientInfo: {},

    langMenus: [],

    userProfilePath: '',
    userExtcredits: false,

    // 多端应用 Android 升级
    downloadApk: false,
    downloadProgress: 0, // 下载进度
    downloadTotalWritten: '', // 已经下载的数据长度
    downloadTotalExpectedToWrite: '', // 预期需要下载的数据总长度
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    // 登录按钮文字
    let loginBtnText = await fresnsLang('accountLoginOrRegister'); // 登录或注册
    const registerStatus = await fresnsConfig('account_register_status');
    if (!registerStatus) {
      loginBtnText = await fresnsLang('accountLoginGoTo'); // 前往登录
    }

    // 多语言菜单
    const langMenusArr = await fresnsConfig('language_menus');

    const langMenus = langMenusArr.filter((item) => item.isEnabled).map((item) => {
      let text = item.langName;
      if (item.areaName) {
        text = item.langName + ' (' + item.areaName + ')';
      }

      const newItem = {
        text: text,
        value: item.langTag,
      };

      if (item.langTag === fresnsClient.langTag) {
        newItem.type = 'warn';
      }

      return newItem;
    });

    this.setData({
      title: await fresnsConfig('channel_me_name'),

      accountLoginService: await fresnsConfig('account_login_service'),
      enableWeChatLogin: fresnsClient.enableWeChatLogin,

      appBaseInfo: fresnsClient.appBaseInfo,

      fresnsConfig: await fresnsConfig(),
      fresnsLang: await fresnsLang(),

      loginBtnText: loginBtnText,

      accountLogin: fresnsAuth.accountLogin,
      userLogin: fresnsAuth.userLogin,
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsOverview: await fresnsOverview(),
      userProfilePath: await fresnsViewProfilePath(),

      langMenus: langMenus,
    });
  },

  /** 监听页面显示 **/
  onShow: async function() {
    this.setData({
      accountLogin: fresnsAuth.accountLogin,
      userLogin: fresnsAuth.userLogin,
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsOverview: await fresnsOverview(),
    });
  },

  /** 监听页面渲染完成 **/
  onReady: async function () {
    const appBaseInfo = fresnsClient.appBaseInfo;

    appBaseInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    if (appBaseInfo.isWechat) {
      const fresnsStatus = await fresnsApi.global.status();
      const clientInfo = fresnsStatus?.client?.mobile[appBaseInfo.platform];

      this.setData({
        clientInfo: clientInfo,
      });

      return;
    }

    const fresnsStatus = await fresnsApi.global.status();
    const clientInfo = fresnsStatus?.client?.mobile[appBaseInfo.platform];
    const checkVersion = versionCompare(fresnsClient.version, clientInfo?.version);

    console.log('Auto Check Version', fresnsClient.version, clientInfo?.version, checkVersion);

    if (clientInfo?.version == fresnsClient.version || checkVersion != -1) {
      appBaseInfo.hasNewVersion = false;
      this.setData({
        appBaseInfo: appBaseInfo,
      });
      wx.setStorageSync('appBaseInfo', appBaseInfo);

      return;
    }

    appBaseInfo.hasNewVersion = true;
    appBaseInfo.apkUrl = clientInfo?.downloads?.apk;
    this.setData({
      appBaseInfo: appBaseInfo,
      clientInfo: clientInfo,
    });
    wx.setStorageSync('appBaseInfo', appBaseInfo);

    // 弹窗显示版本更新内容
    const langTag = wx.getStorageSync('langTag');
    let self = this;

    wx.showModal({
      title: '🎉 ' + clientInfo.version,
      content: clientInfo.describe[langTag] || clientInfo.describe.default,
      cancelText: await fresnsLang('cancel'),
      confirmText: await fresnsLang('upgrade'),
      success(res) {
        if (res.confirm) {
          self.onUpdateApp();
        }
      },
    });
  },

  // 下拉刷新被触发
  onRefresherRefresh: async function () {
    if (isRefreshing) {
      console.log('防抖判断');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

    this.setData({
      navbarLoading: true,
      refresherStatus: true,
    });

    await this.reloadUserData(); // 重载用户数据

    this.setData({
      navbarLoading: false,
      refresherStatus: false,
    });

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  // 重载用户数据
  reloadUserData: async function () {
    wx.removeStorageSync('fresnsAccountData');
    wx.removeStorageSync('fresnsUserData');
    clearCache('fresnsCacheOverviewTags');
    this.setData({
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsOverview: await fresnsOverview(),
    });
  },

  // 修改通知消息数
  onChangeUnreadNotifications: function () {
    console.log('onChangeUnreadNotifications account');

    const fresnsOverview = this.data.fresnsOverview;
    const newCount = fresnsOverview.unreadNotifications.all - 1;

    fresnsOverview.unreadNotifications.all = newCount;

    this.setData({
      fresnsOverview: fresnsOverview,
    });
  },

  // 修改私信消息数
  onChangeUnreadMessages: function (count = 1) {
    console.log('onChangeUnreadMessages account', count);

    const fresnsOverview = this.data.fresnsOverview;
    const newCount = fresnsOverview.conversations.unreadMessages - count;

    fresnsOverview.conversations.unreadMessages = newCount;

    this.setData({
      fresnsOverview: fresnsOverview,
    });
  },

  // 展开用户积分
  onClickExtcredits: function () {
    this.setData({
      userExtcredits: !this.data.userExtcredits,
    });
  },

  // 登录
  toLoginPage: function () {
    wx.navigateTo({
      url: '/pages/me/login',
      routeType: 'wx://cupertino-modal-inside',
    })
  },

  /** 切换语言菜单 **/
  switchLanguage: async function () {
    const langMenus = this.data.langMenus;
    const itemList = langMenus.map(item => item.text);

    wx.showActionSheet({
      itemList: itemList,

      success: async (res) => {
        const newLang = langMenus[res.tapIndex];

        await switchLangTag(newLang.value);

        // 更新数据
        this.setData({
          title: await fresnsConfig('channel_me_name'),
          fresnsConfig: await fresnsConfig(),
          fresnsLang: await fresnsLang(),
        });

        // 重载页面
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
      fail: (res) => {
        console.log(res.errMsg);
      },
    })
  },

  /** 退出登录 **/
  onClickLogout: async function () {
    wx.showModal({
      title: await fresnsLang('accountLogout'),
      cancelText: await fresnsLang('cancel'),
      confirmText: await fresnsLang('confirm'),
      confirmColor: '#fa5151',
      success: async (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          await fresnsLogin.logout();

          this.setData({
            accountLogin: false,
            userLogin: false,

            fresnsAccount: null,
            fresnsUser: null,
            fresnsOverview: null,
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /** 多端应用: 下载应用 **/
  onDownloadApp: function (e) {
    const fresnsLang = this.data.fresnsLang;
    const appBaseInfo = this.data.appBaseInfo;
    const clientInfo = this.data.clientInfo;

    // appBaseInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    let title;
    let content;

    switch (appBaseInfo.platform) {
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

  /** 多端应用: 检测版本 **/
  onCheckVersion: async function (e) {
    wx.showToast({
      title: await fresnsLang('inProgress'),
      icon: 'none',
    });

    const appBaseInfo = fresnsClient.appBaseInfo;

    // appBaseInfo.platform = 'android'; // 测试使用，因为开发者工具里是 devtools

    const fresnsStatus = await fresnsApi.global.status();
    const clientInfo = fresnsStatus?.client?.mobile[appBaseInfo.platform];
    const checkVersion = versionCompare(fresnsClient.version, clientInfo?.version);

    console.log('checkVersion', fresnsClient.version, clientInfo?.version, checkVersion);

    if (clientInfo?.version == fresnsClient.version || checkVersion != -1) {
      wx.showToast({
        title: await fresnsLang('isLatestVersion'),
        icon: 'none',
      });

      return;
    }

    appBaseInfo.hasNewVersion = true;
    appBaseInfo.apkUrl = clientInfo?.downloads?.apk;
    this.setData({
      appBaseInfo: appBaseInfo,
      clientInfo: clientInfo,
    });
    wx.setStorageSync('appBaseInfo', appBaseInfo);

    // 弹窗显示版本更新内容
    const langTag = wx.getStorageSync('langTag');
    let self = this;

    wx.showModal({
      title: '🎉 ' + clientInfo.version,
      content: clientInfo.describe[langTag] || clientInfo.describe.default,
      cancelText: await fresnsLang('cancel'),
      confirmText: await fresnsLang('upgrade'),
      success(res) {
        if (res.confirm) {
          self.onUpdateApp();
        }
      },
    });
  },

  /** 多端应用: 升级 **/
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

    const appBaseInfo = this.data.appBaseInfo;

    switch (appBaseInfo.platform) {
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
        console.log(appBaseInfo.apkUrl);

        const downloadTask = wx.downloadFile({
          url: appBaseInfo.apkUrl,
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
});
