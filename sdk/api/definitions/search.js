/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

const search = {
  /**
   * 搜索用户
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  users: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/users',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 搜索小组
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  groups: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/groups',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 搜索话题
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  hashtags: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/hashtags',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 搜索地理
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  geotags: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/geotags',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 搜索帖子
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  posts: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/posts',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },

  /**
   * 搜索评论
   * @param {Object} options
   * @return {wx.RequestTask}
   */
  comments: (options = {}) => {
    return request({
      path: '/api/fresns/v1/search/comments',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default search;
