/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../../configs/fresnsGlobalInfo'
import Api from '../../api/api'

/**
 * 我关注的用户
 */
Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor'),
    require('../../mixin/handler/userHandler')
  ],
  data: {
    // 当前页面数据
    users: [],
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
      viewType: 2,
      viewTarget: 1,
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        users: this.data.users.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
})
