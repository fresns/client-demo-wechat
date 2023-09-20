/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import './libs/Mixins';
import { fresnsApi } from './api/api';
import { globalInfo } from './utils/fresnsGlobalInfo';
import { cachePut } from './utils/fresnsUtilities';

const themeListeners = [];

App({
  // 全局数据
  globalData: {
    theme: 'light', // dark

    // fresns extensions
    fresnsExtensions: {},
    extensionsUrl: '',
    extensionsTitle: '',
  },

  // 监听小程序初始化
  onLaunch: async function () {
    // 版本检测
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，重新进入小程序使用新版',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              showCancel: false,
              confirmText: false,
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用本小程序，请升级到最新版微信。',
        showCancel: false,
        confirmText: false,
      });
    }

    // 主题配置
    const appBaseInfo = wx.getAppBaseInfo();
    this.onThemeChange(appBaseInfo);
  },

  // 监听小程序启动
  onShow: async function () {
    await globalInfo.init();

    // 站点状态
    try {
      const fresnsStatus = await fresnsApi.global.globalStatus();
      const langTag = wx.getStorageSync('langTag');

      if (!fresnsStatus.activate) {
        const deactivateDescription =
          fresnsStatus.deactivateDescription[langTag] || fresnsStatus.deactivateDescription.default;

        wx.showModal({
          content: deactivateDescription,
          showCancel: false,
          confirmText: false,
        });
      }
    } catch (e) {
      console.log('fresnsStatus', e);
    }

    // 全局配置
    try {
      const configValue = wx.getStorageSync('fresnsConfigs');
      if (!configValue) {
        console.log('globalConfigs', 'fresnsConfigs');
        const result = await fresnsApi.global.globalConfigs();
        const cacheMinutes = result.data.cache_minutes || 30;

        if (result.code === 0 && result?.data) {
          cachePut('fresnsConfigs', result.data, cacheMinutes);
        }
      }
    } catch (e) {
      console.log('fresnsConfigs', e);
    }
  },

  // 监听系统主题变化
  onThemeChange(result) {
    this.globalData.theme = result.theme;

    themeListeners.forEach((listener) => {
      listener(result.theme);
    });
  },

  // 主题变更
  themeChanged(theme) {
    this.onThemeChange({ theme });
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener);
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener);
    if (index > -1) {
      themeListeners.splice(index, 1);
    }
  },
});
