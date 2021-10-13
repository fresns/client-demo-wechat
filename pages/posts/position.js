/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  /** Tab 切换 **/
  data: {
    post: null,
    postCommon: null,
    location: {
      latitude: null,
      longitude: null,
    },
    // 当前页面数据
    posts: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function (options) {
    const { pid } = options
    console.log('pid:', pid)

    const curPostRes = await Api.content.postDetail({
      pid: pid,
    })

    if (curPostRes.code === 0) {
      const { detail, common } = curPostRes.data
      this.setData({
        post: detail,
        postCommon: common,
      })

      const { latitude, longitude } = detail.location
      this.setData({
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      })

    }
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const { latitude, longitude } = this.data.location
    if (!latitude || !longitude) {
      return
    }

    // 如果经纬度存在，则获取附近的帖子
    const resultRes = await Api.content.postNearbys({
      mapId: 5,
      longitude: longitude,
      latitude: latitude,
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
