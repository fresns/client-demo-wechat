/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const group = {
  /**
   * 获取小组[列表] 树结构
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  tree: (options = {}) => {
    return request({
      path: '/api/fresns/v1/group/tree',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取小组[列表]
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  list: (options = {}) => {
    return request({
      path: '/api/fresns/v1/group/list',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取小组[详情]
   * @param {String} gid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  detail: (gid, options = {}) => {
    return request({
      path: '/api/fresns/v1/group/' + gid + '/detail',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取小组[详情] 创建者
   * @param {String} gid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  creator: (gid, options = {}) => {
    return request({
      path: '/api/fresns/v1/group/' + gid + '/creator',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取小组[详情] 管理员
   * @param {String} gid
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  admins: (gid, options = {}) => {
    return request({
      path: '/api/fresns/v1/group/' + gid + '/admins',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 获取小组[详情] 互动列表
   * @param {String} gid
   * @param {String} type likers, dislikers, followers, blockers
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  interaction: (gid, type, options = {}) => {
    return request({
      path: '/api/fresns/v1/group/' + gid + '/interaction/' + type,
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default group;
