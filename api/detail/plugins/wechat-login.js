/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../../tool/request';

/**
 * 微信登录
 * https://marketplace.fresns.cn/open-source/detail/WeChatLogin
 */

const wechatLogin = {
  // 微信小程序登录
  oauth: (options = {}) => {
    return request({
      url: '/api/wechat-login/mini-program/oauth',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  // 微信小程序授权网页登录
  oauthWebsite: (options = {}) => {
    return request({
      url: '/api/wechat-login/mini-program/oauth-website',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  // 多端应用 App 微信账号登录
  oauthApp: (options = {}) => {
    return request({
      url: '/api/wechat-login/open-platform/oauth',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  // 多端应用 Apple 账号登录
  oauthApple: (options = {}) => {
    return request({
      url: '/api/wechat-login/mini-app/oauth-apple',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },
};

export default wechatLogin;
