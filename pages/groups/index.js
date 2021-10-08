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
    require('../../mixin/handler/groupHandler'),
  ],
  data: {
    vtabs: [],
    activeTab: 0,

    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    groupCategories: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  async onLoad () {
    this.data.requestBody = await getConfigItemValue('menu_group_config')
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.content.groupTrees(Object.assign(this.data.requestBody || {}, {
      page: this.data.page,
    }))

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      const target = this.data.groupCategories.concat(list).map(groupCategory => {
        groupCategory.tGroups = groupCategory.groups.slice(0, 10)
        return groupCategory
      })
      this.setData({
        groupCategories: target,
        vtabs: target.map(category => ({ title: category.gname || '默认分类' })),
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
      title: 'Fresns 小组',
    }
  },
  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns 小组',
    }
  },
})
