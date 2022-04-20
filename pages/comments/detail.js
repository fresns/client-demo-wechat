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
    comments: [],

    isShowShareChoose: false,

    quickCommentValue: '',
    quickCommentImage: null,
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  shareComment: null,
  onLoad: async function (options) {
    const { cid } = options
    this.setData({ cid: cid })
    await this.loadCommentDetail()
    await this.loadCommentList()
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
  loadCommentList: async function () {
    const { isReachBottom } = this.data
    if (isReachBottom) {
      return
    }

    const { cid, page, comments } = this.data
    const resultRes = await Api.content.commentLists({
      searchCid: cid,
      page: page,
    })
    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        comments: comments.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this.loadCommentList()
  },
  onInputChange: function (e) {
    const value = e.detail.value
    this.setData({
      quickCommentValue: value,
    })
    return value
  },
  onSelectImage: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const { tempFilePaths, tempFiles } = res
        const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
          type: 1,
          tableType: 8,
          tableName: 'post_logs',
          tableColumn: 'files_json',
          mode: 1,
          file: tempFilePaths[0],
        })

        const resultFile = uploadRes.data.files[0]
        this.setData({
          quickCommentImage: resultFile,
        })
      },
    })
  },
  quickComment: async function () {
    const { cid, pid } = this.data.comment
    const publishRes = await Api.editor.editorPublish({
      type: 2,
      commentPid: pid,
      commentCid: cid,
      content: this.data.quickCommentValue,
      isMarkdown: 0,
      isAnonymous: 0,
      file: this.data.quickCommentImage,
    })
    if (publishRes.code === 0) {
      wx.showToast({
        title: '发布成功',
        icon: 'none',
      })
      this.setData({ quickCommentValue: '', quickCommentImage: null })
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
