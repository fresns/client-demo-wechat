/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

/**
 * 微信登录
 * https://marketplace.fresns.cn/open-source/detail/WeChatLogin
 */

const wechatLogin = {
  // 微信互联信息
  connects: (options = {}) => {
    return request({
      path: '/api/wechat-login/connects',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  // 微信小程序登录
  oauth: (options = {}) => {
    return request({
      path: '/api/wechat-login/mini-program/oauth',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  // 微信小程序授权网页登录
  oauthWebsite: (options = {}) => {
    return request({
      path: '/api/wechat-login/mini-program/oauth-website',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  // 多端应用 App 微信账号登录
  oauthApp: (options = {}) => {
    return request({
      path: '/api/wechat-login/open-platform/oauth',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  // 多端应用 Apple 账号登录
  oauthApple: (options = {}) => {
    return request({
      path: '/api/wechat-login/mini-app/oauth-apple',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },
};

export default wechatLogin;
