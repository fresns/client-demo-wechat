/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import './libs/Mixins';
import { fresnsApi } from './api/api';
import { globalInfo } from './utils/fresnsGlobalInfo';
import { cachePut } from './utils/fresnsUtilities';

const themeListeners = []

App({
  // 全局数据
  globalData: {
    theme: 'light', // dark
  },

  // 监听小程序初始化
  onLaunch: async function () {
    const appBaseInfo = wx.getAppBaseInfo()
    this.onThemeChange(appBaseInfo)
  },

  // 监听小程序启动
  onShow: async function () {
    await globalInfo.init()

    try {
      const configValue = wx.getStorageSync('fresnsConfigs')
      if (!configValue) {
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
    })
  },

  // 主题变更
  themeChanged (theme) {
    this.onThemeChange({ theme })
  },
  watchThemeChange (listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange (listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
})
