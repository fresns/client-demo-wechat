/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const account = {
  /**
   * 登录
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  login: (options = {}) => {
    return request({
      path: '/api/fresns/v1/account/auth-token',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 退出登录
   * @return {wx.RequestTask}
   */
  logout: () => {
    return request({
      path: '/api/fresns/v1/account/auth-token',
      method: 'DELETE',
    });
  },

  /**
   * 获取账号详情
   * @return {wx.RequestTask}
   */
  detail: () => {
    return request({
      path: '/api/fresns/v1/account/detail',
      method: 'GET',
    });
  },

  /**
   * 钱包交易记录
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  walletRecords: (options = {}) => {
    return request({
      path: '/api/fresns/v1/account/wallet-records',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default account;
