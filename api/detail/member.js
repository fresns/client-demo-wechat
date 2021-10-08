/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const { request } = require('../tool/request')

const member = {
  /**
   * 获取成员角色[列表]
   * @return {wx.RequestTask}
   */
  memberRoles: () => {
    return request({
      url: '/api/fresns/member/roles',
    })
  },
  /**
   * 获取成员[互动列表]
   * @return {wx.RequestTask}
   */
  memberInteractions: () => {
    return request({
      url: '/api/fresns/member/interactions',
    })
  },
  /**
   * 获取成员[列表]
   * @return {wx.RequestTask}
   */
  memberLists: (options) => {
    return request({
      url: '/api/fresns/member/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取成员[单个]
   * @param {Object} options 请求参数
   * @param {string} options.viewMid 用户 id
   * @param {string} options.viewMname 用户名称
   * @return {wx.RequestTask}
   */
  memberDetail: (options = {}) => {
    return request({
      url: '/api/fresns/member/detail',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取标记内容[列表]
   * @return {wx.RequestTask}
   */
  memberMarkLists: (options = {}) => {
    return request({
      url: '/api/fresns/member/markLists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 操作删除内容
   * @return {wx.RequestTask}
   */
  memberDelete: () => {
    return request({
      url: '/api/fresns/member/delete',
    })
  },
  /**
   * 操作标记内容
   * @return {wx.RequestTask}
   */
  memberMark: (options) => {
    return request({
      url: '/api/fresns/member/mark',
      data: {
        ...options,
      },
    })
  },
  /**
   * 修改成员资料
   * @return {wx.RequestTask}
   */
  memberEdit: (options) => {
    return request({
      url: '/api/fresns/member/edit',
      data: {
        ...options
      }
    })
  },
  /**
   * 成员登录
   * @return {wx.RequestTask}
   */
  memberAuth: (options) => {
    return request({
      url: '/api/fresns/member/auth',
      data: {
        ...options,
      },
    })
  },
}

module.exports = member
