/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const wechatLogin = {
  /**
   * 微信小程序登录
   * @return {wx.RequestTask}
   */
  oauth: (options = {}) => {
    return request({
      url: '/api/wechat-login/mini-program/oauth',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },

  /**
   * 微信小程序授权网页登录
   * @return {wx.RequestTask}
   */
  oauthWebsite: (options = {}) => {
    return request({
      url: '/api/wechat-login/mini-program/oauth-website',
      data: {
        ...options,
      },
      method: 'POST',
    });
  },
};

module.exports = wechatLogin;
