/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const hashtag = {
  /**
   * 获取话题[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/hashtag/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取话题[详情]
   * @param {String} htid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (htid, options = {}) => {
    return request({
      path: '/api/fresns/v1/hashtag/' + htid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取话题[详情] 互动列表
   * @param {String} htid
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (htid, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/hashtag/' + htid + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default hashtag;
