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
  },

  // 更新全局数据
  onGlobalDataChanged(globalData) {
    this.setData({
      theme: globalData.theme,
      mode: globalData.mode,
    });
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    await this.checkFresnsSiteMode();

    this.loginInterceptor();

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
      'pages/me/login/index',
      'pages/me/login/check-sign',
      'pages/me/login/oauth-website',
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

  // 登录拦截器
  loginInterceptor() {
    const route = getCurrentPageRoute();

    // 不登录账户也可访问的路由
    const whitelistRoutes = [
      'pages/portal/index',
      'pages/portal/about',
      'pages/portal/policies',
      'pages/portal/discover',

      'pages/users/index',
      'pages/users/list',

      'pages/groups/index',
      'pages/groups/list',
      'pages/groups/detail',

      'pages/hashtags/index',
      'pages/hashtags/list',
      'pages/hashtags/detail',

      'pages/geotags/index',
      'pages/geotags/list',
      'pages/geotags/detail',

      'pages/posts/index',
      'pages/posts/list',
      'pages/posts/detail',

      'pages/comments/index',
      'pages/comments/list',
      'pages/comments/detail',

      'pages/nearby/index',
      'pages/nearby/posts',
      'pages/nearby/comments',

      'pages/profile/posts',
      'pages/profile/comments',
      'pages/profile/interactions/likers',
      'pages/profile/interactions/dislikers',
      'pages/profile/interactions/followers',
      'pages/profile/interactions/blockers',
      'pages/profile/likes/users',
      'pages/profile/likes/groups',
      'pages/profile/likes/hashtags',
      'pages/profile/likes/geotags',
      'pages/profile/likes/posts',
      'pages/profile/likes/comments',
      'pages/profile/dislikes/users',
      'pages/profile/dislikes/groups',
      'pages/profile/dislikes/hashtags',
      'pages/profile/dislikes/geotags',
      'pages/profile/dislikes/posts',
      'pages/profile/dislikes/comments',
      'pages/profile/following/users',
      'pages/profile/following/groups',
      'pages/profile/following/hashtags',
      'pages/profile/following/geotags',
      'pages/profile/following/posts',
      'pages/profile/following/comments',
      'pages/profile/blocking/users',
      'pages/profile/blocking/groups',
      'pages/profile/blocking/hashtags',
      'pages/profile/blocking/geotags',
      'pages/profile/blocking/posts',
      'pages/profile/blocking/comments',

      'pages/search/index',

      'pages/me/index',
      'pages/me/login/index',
      'pages/me/login/check-sign',
      'pages/me/login/oauth-website',
    ];

    if (whitelistRoutes.includes(route)) {
      return;
    }

    // 未登录账号，跳转到登录页
    if (!fresnsAuth.accountLogin) {
      wx.navigateTo({
        url: '/pages/me/login/index?showToast=true',
        routeType: 'wx://cupertino-modal-inside',
      });

      return;
    }

    // 不登录用户也可访问的路由
    const userWhitelistRoutes = ['pages/me/users'];

    if (userWhitelistRoutes.includes(route)) {
      return;
    }

    // 未登录用户，跳转到用户选择页
    if (!fresnsAuth.userLogin) {
      wx.redirectTo({
        url: '/pages/me/users?showToast=true',
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
