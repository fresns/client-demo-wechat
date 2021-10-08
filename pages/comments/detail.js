/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  /** 页面数据 **/
  data: {
    cid: null,
    comment: null,
    commentCommon: null,

    isShowShareChoose: false,

    quickReplyContent: '',
    quickReplyAnonymous: false,
  },
  shareComment: null,
  onLoad: async function (options) {
    const { cid } = options
    this.setData({ cid: cid })
    await this.loadCommentDetail()
  },
  loadCommentDetail: async function () {
    const { cid } = this.data
    const commentDetailRes = await Api.content.commentDetail({
      cid: cid,
    })
    if (commentDetailRes.code === 0) {
      this.setData({
        comment: commentDetailRes.data.detail,
        commentCommon: commentDetailRes.data.common,
      })
    }
  },
  quickReplyComment: async function () {
    const { cid, quickReplyContent, quickReplyAnonymous } = this.data
    const publishRes = await Api.editor.editorPublish({
      type: 2,
      commentPid: cid,
      content: quickReplyContent,
      isMarkdown: 0,
      isAnonymous: quickReplyAnonymous,
    })
    if (publishRes.code === 0) {
      wx.showToast({
        title: '发布成功',
        icon: 'none',
      })
      await this.loadCommentDetail()
    }
  },
  /**
   * comment 列表点击分享按钮
   */
  onClickShare: async function (comment) {
    this.shareComment = comment
    this.setData({
      isShowShareChoose: true,
    })
  },
  /**
   * 点击复制网址
   */
  onClickCopyPath: async function () {
    const domain = await getConfigItemValue('site_domain')
    const res = `${domain}/comment/${this.shareComment.cid}`
    wx.setClipboardData({ data: res })
  },
  onClickCancelShareChoose: function () {
    this.setData({
      isShowShareChoose: false,
    })
  },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function (options) {
    const { from } = options

    if (from === 'button') {
      const { content, cid } = this.shareComment
      return {
        title: content,
        path: `/pages/comments/detail?cid=${cid}`,
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
