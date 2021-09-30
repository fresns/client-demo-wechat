/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

const Api = require('../../api/api')
Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  /** Tab 切换 **/
  data: {
    // 当前页面数据
    posts: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function () {
    // TODO add request params
    const resultRes = await Api.content.postNearbys()
    if (resultRes.code === 0) {

    }
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.content.postNearbys({
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        posts: this.data.posts.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
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
