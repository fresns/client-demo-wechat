/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
require('./libs/Mixins.js');

import { fresnsInit } from './sdk/services';

const listeners = []; // 监听事件

App({
  /** 全局数据 **/
  globalData: {
    theme: 'light', // dark
    mode: '', // 模式(care：关怀模式)
  },

  /** 监听小程序初始化 **/
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
  },

  /** 监听小程序启动 **/
  onShow: async function () {
    await fresnsInit();
  },

  /** 注册监听函数 **/
  watchGlobalDataChanged(listener) {
    if (listeners.indexOf(listener) < 0) {
      listeners.push(listener);
    }
  },

  /** 注销监听函数 **/
  unWatchGlobalDataChanged(listener) {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  },

  /** 监听系统主题改变事件 **/
  onThemeChange: function (result) {
    this.changeGlobalData({
      theme: result.theme,
    });
  },

  /** 更新全局数据 **/
  changeGlobalData(data) {
    this.globalData = Object.assign({}, this.globalData, data);
    listeners.forEach((listener) => {
      listener(this.globalData);
    });
  },
});
