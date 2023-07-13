/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const comment = {
  /**
   * 获取评论[列表]
   * @return {wx.RequestTask}
   */
  commentList: (options = {}) => {
    return request({
      url: '/api/v2/comment/list',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[列表] 关注对象的
   * @return {wx.RequestTask}
   */
  commentFollow: (options = {}) => {
    return request({
      url: '/api/v2/comment/follow/' + options.type,
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[列表] 位置附近的
   * @return {wx.RequestTask}
   */
  commentNearby: (options = {}) => {
    return request({
      url: '/api/v2/comment/nearby',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情]
   * @return {wx.RequestTask}
   */
  commentDetail: (options = {}) => {
    return request({
      url: '/api/v2/comment/' + options.cid + '/detail',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情] 互动列表
   * @return {wx.RequestTask}
   */
  commentInteraction: (options = {}) => {
    return request({
      url: '/api/v2/comment/' + options.cid + '/interaction/' + options.type,
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情] 日志列表
   * @return {wx.RequestTask}
   */
  commentLogs: (options = {}) => {
    return request({
      url: '/api/v2/comment/' + options.cid + '/logs',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情] 日志详情
   * @return {wx.RequestTask}
   */
  commentInteraction: (options = {}) => {
    return request({
      url: '/api/v2/comment/' + options.cid + '/log/' + options.logId,
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除评论
   * @return {wx.RequestTask}
   */
  commentDelete: (options = {}) => {
    return request({
      url: '/api/v2/comment/' + options.cid,
      data: {
        ...options,
      },
      method: 'DELETE',
    });
  },
};

module.exports = comment;
