/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
    require('../../mixin/handler/postHandler'),
  ],
  data: {
    // 详情
    posts: [],
    // 评论列表
    commentList: [],

    isShowShareChoose: false,
  },
  sharePost: null,
  onLoad: async function (options) {
    const { pid } = options
    const postDetailRes = await Api.content.postDetail({
      pid: pid,
    })
    if (postDetailRes.code === 0) {
      this.setData({
        posts: [postDetailRes.data.detail],
      })
    }

    const commentsRes = await Api.content.commentLists({
      searchPid: pid,
    })
    if (commentsRes.code === 0) {
      this.setData({
        commentList: commentsRes.data.list,
      })
    }
  },
  /**
   * post 列表点击分享按钮
   */
  onClickShare: async function (post) {
    this.sharePost = post
    this.setData({
      isShowShareChoose: true,
    })
  },
  /**
   * 点击复制网址
   */
  onClickCopyPath: async function () {
    const domain = await getConfigItemValue('site_domain')
    const res = `${domain}/post/${this.sharePost.pid}`
    wx.setClipboardData({ data: res })
  },
  onClickCancelShareChoose: function () {
    this.setData({
      isShowShareChoose: false,
    })
  },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function (options) {
    const { from, target, webViewUrl } = options

    if (from === 'button') {
      const { title, pid } = this.sharePost
      return {
        title: title,
        path: `/pages/posts/detail?pid=${pid}`,
      }
    }

    return {
      title: 'Fresns',
    }
  },
  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns',
    }
  },
})
