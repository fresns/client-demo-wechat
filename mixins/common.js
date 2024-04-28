/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../sdk/helpers/configs';
import { fresnsAuth } from '../sdk/helpers/profiles';
import { getCurrentPageRoute } from '../sdk/utilities/toolkit';

module.exports = {
  /** 页面的初始数据 **/
  data: {
    theme: '',
    mode: '', // 模式(care：关怀模式)

    navbarBackButton: false,
    navbarHomeButton: false,
    navbarLoading: false,

    refresherStatus: false,
  },

  // 更新全局数据
  onGlobalDataChanged(globalData) {
    this.setData({
      theme: globalData.theme,
      mode: globalData.mode,
    });
  },

  /** 监听页面加载 **/
  onLoad() {
    this.checkFresnsSiteMode();

    const app = getApp();

    this.setData({
      theme: app.globalData.theme,
      mode: app.globalData.mode,
    });

    // 监听全局数据变化
    app.watchGlobalDataChanged(this.onGlobalDataChanged);
  },

  /** 监听页面退出 **/
  onUnload() {
    // 注销监听全局数据变化
    getApp().unWatchGlobalDataChanged(this.onGlobalDataChanged);
  },

  // 站点模式处理
  checkFresnsSiteMode: async function () {
    const siteMode = await fresnsConfig('site_mode');

    // 公开模式
    if (siteMode == 'public') {
      return;
    }

    // 私有模式
    if (fresnsAuth.userLogin) {
      // 已登录
      return;
    }

    console.log('Check Site Mode', siteMode);

    const whitelistRoutes = [
      'sdk/extensions/webview',
      'pages/portal/about',
      'pages/portal/policies',
      'pages/me/index',
      'pages/me/login',
      'pages/me/wechat-login/check-sign',
      'pages/me/wechat-login/website-oauth',
    ];
    const route = getCurrentPageRoute();

    if (whitelistRoutes.includes(route)) {
      // 白名单路由
      return;
    }

    if (route !== 'pages/portal/private') {
      // 跳转到私有模式介绍页面
      wx.redirectTo({
        url: '/pages/portal/private',
      });
    }
  },

  // 进入首页
  onFresnsGoHome() {
    wx.reLaunch({
      url: '/pages/posts/index',
    });
  },

  // 后退页面
  onFresnsBack(delta = 1) {
    wx.navigateBack({
      delta: delta,
      fail() {
        wx.reLaunch({
          url: '/pages/posts/index',
        });
      },
    });
  },
};
