/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import { getConfigItemValue } from '../../api/tool/replace-key'
import Api from '../../api/api'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  /** 页面数据 **/
  data: {
    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    posts: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function () {
    this.data.requestBody = await getConfigItemValue('menu_post_config')
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.content.postLists(Object.assign(this.data.requestBody || {}, {
      page: this.data.page,
    }))

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
