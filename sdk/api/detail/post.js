/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const post = {
  /**
   * 获取帖子[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/post/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[列表] 时间线
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  timelines: (options = {}) => {
    return request({
      path: '/api/fresns/v1/post/timelines',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[列表] 附近
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  nearby: (options = {}) => {
    return request({
      path: '/api/fresns/v1/post/nearby',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情]
   * @param {String} pid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (pid, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/' + pid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 互动列表
   * @param {String} pid
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (pid, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/' + pid + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 附属用户列表
   * @param {String} pid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  users: (pid, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/' + pid + '/users',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 引用它的帖子列表
   * @param {String} pid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  quotes: (pid, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/' + pid + '/quotes',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 历史列表
   * @param {String} pid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  histories: (pid, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/' + pid + '/histories',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取历史帖子[详情]
   * @param {String} hpid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  historyDetail: (hpid, options = {}) => {
    return request({
      path: '/api/fresns/v1/post/history/' + hpid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除帖子
   * @param {String} pid
   * @return {wx.RequestTask}
   */
  delete: (pid) => {
    return request({
      path: '/api/fresns/v1/post/' + pid,
      method: 'DELETE',
    });
  },
};

export default post;
