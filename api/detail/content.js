const { request } = require('../tool/request')

const content = {
  /**
   * 获取评论[单条]
   * @return {wx.RequestTask}
   */
  commentDetail: () => {
    return request({
      url: '/api/fresns/comment/detail',
    })
  },
  /**
   * 获取评论[列表]
   * @return {wx.RequestTask}
   */
  commentLists: (options) => {
    return request({
      url: '/api/fresns/comment/lists',
      data: {
        ...options
      }
    })
  },
  /**
   * 获取帖子附近的[列表]
   * @return {wx.RequestTask}
   */
  postNearbys: () => {
    return request({
      url: '/api/fresns/post/nearbys',
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
   * @param {number} options.sortNumber
   * @param {number} options.pageSize
   * @param {number} options.page
   * @return {wx.RequestTask}
   */
  postFollows: (options = {}) => {
    return request({
      url: '/api/fresns/post/follows',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取帖子[单条]
   * @return {wx.RequestTask}
   */
  postDetail: () => {
    return request({
      url: '/api/fresns/post/detail',
    })
  },
  /**
   * 获取帖子[列表]
   * @return {wx.RequestTask}
   */
  postLists: (options) => {
    return request({
      url: '/api/fresns/post/lists',
      data: {
        ...options
      }
    })
  },
  /**
   * 获取话题[单条]
   * @return {wx.RequestTask}
   */
  hashtagDetail: () => {
    return request({
      url: '/api/fresns/hashtag/detail',
    })
  },
  /**
   * 获取话题[列表]
   * @return {wx.RequestTask}
   */
  hashtagLists: (options) => {
    return request({
      url: '/api/fresns/hashtag/lists',
      data: {
        ...options
      }
    })
  },
  /**
   * 获取小组[单条]
   * @return {wx.RequestTask}
   */
  groupDetail: () => {
    return request({
      url: '/api/fresns/group/detail',
    })
  },
  /**
   * 获取小组[列表]
   * @return {wx.RequestTask}
   */
  groupLists: (options) => {
    return request({
      url: '/api/fresns/group/lists',
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
      url: '/api/fresns/group/trees',
      data: {
        ...options,
      },
    })
  },
}

module.exports = content
