/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'
import { globalInfo } from '../../configs/fresnsGlobalInfo'


Page({
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor')
  ],
  data: {
    // 当前页面数据
    hashtags: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function () {
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.user.userMarkLists({
      viewUid: globalInfo.currentUserId,
      viewType: 3,
      viewTarget: 3,
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        hashtags: this.data.hashtags.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
})
