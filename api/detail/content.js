/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
const { request } = require('../tool/request')

const content = {
  /**
   * 获取评论[单条]
   * @return {wx.RequestTask}
   */
  commentDetail: (options) => {
    return request({
      url: '/api/v1/comment/detail',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取评论[列表]
   * @return {wx.RequestTask}
   */
  commentLists: (options) => {
    return request({
      url: '/api/v1/comment/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取帖子附近的[列表]
   * @return {wx.RequestTask}
   */
  postNearbys: (options) => {
    return request({
      url: '/api/v1/post/nearbys',
      data: {
        ...options
      }
    })
  },
  /**
   * 获取帖子关注的[列表]
   * @param {Object} options
   * @param {string} options.searchType
   * @param {string} options.searchKey
   * @param {string} options.followType
   * @param {number} options.mapId
   * @param {string} options.longitude
   * @param {string} options.latitude
   * @param {number} options.rankNumber
   * @param {number} options.pageSize
   * @param {number} options.page
   * @return {wx.RequestTask}
   */
  postFollows: (options = {}) => {
    return request({
      url: '/api/v1/post/follows',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取帖子[单条]
   * @return {wx.RequestTask}
   */
  postDetail: (options) => {
    return request({
      url: '/api/v1/post/detail',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取帖子[列表]
   * @return {wx.RequestTask}
   */
  postLists: (options) => {
    return request({
      url: '/api/v1/post/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取话题[单条]
   * @return {wx.RequestTask}
   */
  hashtagDetail: (options) => {
    return request({
      url: '/api/v1/hashtag/detail',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取话题[列表]
   * @return {wx.RequestTask}
   */
  hashtagLists: (options) => {
    return request({
      url: '/api/v1/hashtag/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取小组[单条]
   * @return {wx.RequestTask}
   */
  groupDetail: (options) => {
    return request({
      url: '/api/v1/group/detail',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取小组[列表]
   * @return {wx.RequestTask}
   */
  groupLists: (options) => {
    return request({
      url: '/api/v1/group/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取小组[树结构列表]
   * @return {wx.RequestTask}
   */
  groupTrees: (options) => {
    return request({
      url: '/api/v1/group/trees',
      data: {
        ...options,
      },
    })
  },
}

module.exports = content
