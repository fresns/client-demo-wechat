/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
  ],

  /** 页面的初始数据 **/
  data: {
    userDeactivate: null,
    conversations: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_conversations'),
    });

    this.setData({
      userDeactivate: await fresnsLang('userDeactivate'),
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });
    wx.showNavigationBarLoading();

    const resultRes = await fresnsApi.message.conversationList({
      whitelistKeys: 'avatar,nickname,status',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;

      const listCount = list.length + this.data.conversations.length;

      let tipType = 'none';
      if (isReachBottom && paginate.lastPage > 1) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      this.setData({
        conversations: this.data.conversations.concat(list),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      });
    }

    wx.hideNavigationBarLoading();
    this.setData({
      loadingStatus: false,
    });
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    // 防抖判断
    if (isRefreshing) {
      wx.stopPullDownRefresh();
      return;
    }

    isRefreshing = true;

    this.setData({
      conversations: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    });

    await this.loadFresnsPageData();

    wx.stopPullDownRefresh();
    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  /** 监听用户上拉触底 **/
  onReachBottom: async function () {
    await this.loadFresnsPageData();
  },

  // 标记已读
  onMarkRead(id) {
    const conversations = this.data.conversations;
    if (!conversations) {
      return;
    }

    const idx = conversations.findIndex((value) => value.id == id);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    const unreadCount = conversations[idx].unreadCount;

    conversations[idx].unreadCount = 0;

    this.setData({
      conversations: conversations,
    });

    wx.removeStorageSync('fresnsUserPanels');
  },
});
