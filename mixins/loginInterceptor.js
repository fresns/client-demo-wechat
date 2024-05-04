/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsAuth } from '../sdk/helpers/profiles';
import { getCurrentPageRoute } from '../sdk/utilities/toolkit';

module.exports = {
  /** 监听页面加载 **/
  onLoad: function () {
    const route = getCurrentPageRoute();

    const accountRoutes = ['pages/me/index', 'pages/me/login/index'];

    // 未登录账号，跳转到登录页
    if (!fresnsAuth.accountLogin && !accountRoutes.includes(route)) {
      wx.redirectTo({
        url: '/pages/me/login/index?showToast=true',
      });
    }

    const userRoutes = ['pages/me/index', 'pages/me/login/index', 'pages/me/users'];

    // 未登录用户，跳转到用户选择页
    if (!fresnsAuth.userLogin && !userRoutes.includes(route)) {
      wx.redirectTo({
        url: '/pages/me/users?showToast=true',
      });
    }
  },
};
