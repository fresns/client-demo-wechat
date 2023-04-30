/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const post = {
  /**
   * 获取帖子[列表]
   * @return {wx.RequestTask}
   */
  postList: (options = {}) => {
    return request({
      url: '/api/v2/post/list',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[列表] 关注对象的
   * @return {wx.RequestTask}
   */
  postFollow: (options = {}) => {
    return request({
      url: '/api/v2/post/follow/' + options.type,
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[列表] 位置附近的
   * @return {wx.RequestTask}
   */
  postNearby: (options = {}) => {
    return request({
      url: '/api/v2/post/nearby',
      data: {
        ...options
      }
    });
  },

  /**
   * 获取帖子[详情]
   * @return {wx.RequestTask}
   */
  postDetail: (options = {}) => {
    return request({
      url: '/api/v2/post/' + options.pid + '/detail',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 互动列表
   * @return {wx.RequestTask}
   */
  postInteraction: (options = {}) => {
    return request({
      url: '/api/v2/post/' + options.pid + '/interaction/' + options.type,
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 附属用户列表
   * @return {wx.RequestTask}
   */
  postUsers: (options = {}) => {
    return request({
      url: '/api/v2/post/' + options.pid + '/users',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 日志列表
   * @return {wx.RequestTask}
   */
  postLogs: (options = {}) => {
    return request({
      url: '/api/v2/post/' + options.pid + '/logs',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取帖子[详情] 日志详情
   * @return {wx.RequestTask}
   */
  postInteraction: (options = {}) => {
    return request({
      url: '/api/v2/post/' + options.pid + '/log/' + options.logId,
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除帖子
   * @return {wx.RequestTask}
   */
  postDelete: (options = {}) => {
    return request({
      url: '/api/v2/post/delete' + options.pid,
      data: {
        ...options,
      },
      method: 'DELETE',
    });
  },
}

module.exports = post
