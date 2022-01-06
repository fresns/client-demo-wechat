/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'
import Api from '../../api/api'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
    require('../../mixin/handler/commentHandler'),
  ],
  /** 页面数据 **/
  data: {
    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    comments: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,

    isShowShareChoose: false,
  },
  shareComment: null,
  onLoad: async function (options) {
    this.setData({
      requestBody: await getConfigItemValue('menu_comment_config'),
      comments: [],
      page: 1,
      isReachBottom: false,
      isShowShareChoose: false,
    })
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.content.commentLists(Object.assign(this.data.requestBody || {}, {
      page: this.data.page,
    }))

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        comments: this.data.comments.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
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
