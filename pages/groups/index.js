/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('./mixin/groupHandler')
  ],
  /** 页面数据 **/
  data: {
    vtabs: [],
    activeTab: 0,

    // 配置数据库中的请求体
    requestBody: null,
    // 当前页面数据
    groups: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  async onLoad () {
    const titles = ['推荐小组', '小组分类 1', '小组分类 2', '小组分类 3', '小组分类 4', '小组分类 5']
    const vtabs = titles.map(item => ({ title: item }))
    this.setData({ vtabs })

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
      this.setData({
        groups: this.data.groups.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onTabCLick (e) {
    const index = e.detail.index
    console.log('tabClick', index)
  },
  onChange (e) {
    const index = e.detail.index
    console.log('change', index)
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