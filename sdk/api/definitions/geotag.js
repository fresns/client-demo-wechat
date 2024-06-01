/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const geotag = {
  /**
   * 获取地理[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/geotag/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取地理[详情]
   * @param {String} gtid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (gtid, options = {}) => {
    return request({
      path: '/api/fresns/v1/geotag/' + gtid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取地理[详情] 互动列表
   * @param {String} gtid
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (gtid, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/geotag/' + gtid + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default geotag;
