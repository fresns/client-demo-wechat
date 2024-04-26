/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const user = {
  /**
   * 用户登录
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  login: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/auth-token',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 用户概览
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  overview: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/overview',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 用户扩展分值记录
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  extcreditsRecords: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/extcredits-records',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 修改用户资料
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  updateProfile: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/profile',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 更新用户设置
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  updateSettings: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/settings',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 操作标记
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  mark: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/mark',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  /**
   * 更新标记备注
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  updateMarkNote: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/mark-note',
      method: 'PATCH',
      data: {
        ...options,
      },
    });
  },

  /**
   * 操作扩展交互
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  extendAction: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/extend-action',
      method: 'POST',
      data: {
        ...options,
      },
    });
  },

  // Interactive

  /**
   * 获取用户[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/user/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取用户[详情]
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/user/' + uidOrUsername + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取用户[详情] 认识的关注者
   * @param {String} uidOrUsername
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  followersYouKnow: (uidOrUsername, options = {}) => {
    return request({
      path: '/api/fresns/v1/user/' + uidOrUsername + '/followers-you-follow',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取用户[详情] 互动列表
   * @param {String} uidOrUsername
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (uidOrUsername, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/user/' + uidOrUsername + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取用户[详情] 标记列表
   * @param {String} uidOrUsername
   * @param {String} markType like, dislike, follow, block
   * @param {String} listType users, groups, hashtags, geotags, posts, comments
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  markList: (uidOrUsername, markType, listType, options = {}) => {
    return request({
      path: '/api/fresns/v1/user/' + uidOrUsername + '/mark/' + markType + '/' + listType,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default user;
