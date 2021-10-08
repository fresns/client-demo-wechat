/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request'

const user = {
  /**
   * 钱包交易记录
   * @return {wx.RequestTask}
   */
  userWalletLogs: (options) => {
    return request({
      url: '/api/fresns/user/walletLogs',
      data: {
        ...options
      }
    })
  },
  /**
   * 修改用户资料
   * @return {wx.RequestTask}
   */
  userEdit: (options) => {
    return request({
      url: '/api/fresns/user/edit',
      data: {
        ...options
      }
    })
  },
  /**
   * 用户基本信息
   * @return {wx.RequestTask}
   */
  userDetail: () => {
    return request({
      url: '/api/fresns/user/detail',
    })
  },
  /**
   * 重置密码
   * @return {wx.RequestTask}
   */
  userReset: () => {
    return request({
      url: '/api/fresns/user/reset',
    })
  },
  /**
   * 恢复
   * @return {wx.RequestTask}
   */
  userRestore: () => {
    return request({
      url: '/api/fresns/user/restore',
    })
  },
  /**
   * 注销
   * @return {wx.RequestTask}
   */
  userDelete: () => {
    return request({
      url: '/api/fresns/user/delete',
    })
  },
  /**
   * 退出登录
   * @return {wx.RequestTask}
   */
  userLogout: () => {
    return request({
      url: '/api/fresns/user/logout',
    })
  },
  /**
   * 登录
   * @return {wx.RequestTask}
   */
  userLogin: (options) => {
    return request({
      url: '/api/fresns/user/login',
      data: {
        ...options,
      },
    })
  },
  /**
   * 注册
   * @return {wx.RequestTask}
   */
  userRegister: (options) => {
    return request({
      url: '/api/fresns/user/register',
      data: {
        ...options
      }
    })
  },
}

module.exports = user
