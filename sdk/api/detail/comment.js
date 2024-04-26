/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const comment = {
  /**
   * 获取评论[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[列表] 时间线
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  timelines: (options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/timelines',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[列表] 附近
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  nearby: (options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/nearby',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情]
   * @param {String} cid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (cid, options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/' + cid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情] 互动列表
   * @param {String} cid
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (cid, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/' + cid + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取评论[详情] 历史列表
   * @param {String} cid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  histories: (cid, options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/' + cid + '/histories',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取历史评论[详情]
   * @param {String} hcid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  historyDetail: (hcid, options = {}) => {
    return request({
      path: '/api/fresns/v1/comment/history/' + hcid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 删除评论
   * @param {String} cid
   * @return {wx.RequestTask}
   */
  delete: (cid) => {
    return request({
      path: '/api/fresns/v1/comment/' + cid,
      method: 'DELETE',
    });
  },
};

export default comment;
