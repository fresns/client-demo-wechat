/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
  ],

  /** 页面的初始数据 **/
  data: {
    conversationId: null,
    messages: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const conversationId = options.id;
    const userDeactivate = await fresnsLang('userDeactivate');

    this.setData({
      conversationId: conversationId
    })

    const resultRes = await fresnsApi.message.conversationDetail({
      conversationId: conversationId,
      whitelistKeys: 'avatar,nickname,status',
    })

    let title = resultRes.message;
    if (resultRes.code === 0) {
      title = resultRes.data.user.status ? resultRes.data.user.nickname : userDeactivate;
    }

    wx.setNavigationBarTitle({
      title: title,
    });

    await fresnsApi.message.conversationMarkAsRead({
      type: 'conversation',
      conversationId: conversationId,
    })

    await this.loadFresnsPageData()
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    wx.showNavigationBarLoading();

    const resultRes = await fresnsApi.message.conversationMessages({
      conversationId: this.data.conversationId,
      whitelistKeys: 'avatar,nickname,status',
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data
      const isReachBottom = paginate.currentPage === paginate.lastPage
      let tipType = 'none'
      if (isReachBottom) {
        tipType = this.data.messages.length > 0 ? 'page' : 'empty'
      }

      this.setData({
        messages: this.data.messages.concat(list),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      })
    }

    wx.hideNavigationBarLoading();
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    await this.loadFresnsPageData()
  },
});