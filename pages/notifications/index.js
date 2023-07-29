/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    type: null,
    navName: {},
    notifications: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const { type } = options;
    this.setData({
      type: type,
      navName: {
        all: await fresnsConfig('menu_notifications_all'),
        systems: await fresnsConfig('menu_notifications_systems'),
        recommends: await fresnsConfig('menu_notifications_recommends'),
        likes: await fresnsConfig('menu_notifications_likes'),
        dislikes: await fresnsConfig('menu_notifications_dislikes'),
        follows: await fresnsConfig('menu_notifications_follows'),
        blocks: await fresnsConfig('menu_notifications_blocks'),
        mentions: await fresnsConfig('menu_notifications_mentions'),
        comments: await fresnsConfig('menu_notifications_comments'),
        quotes: await fresnsConfig('menu_notifications_quotes'),
      },
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    wx.showNavigationBarLoading();

    const resultRes = await fresnsApi.message.notificationList({
      types: this.data.type,
      userWhitelistKeys: 'uid,fsid,avatar,nickname,username,status',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;
      let tipType = 'none';
      if (isReachBottom) {
        tipType = this.data.notifications.length > 0 ? 'page' : 'empty';
      }

      this.setData({
        notifications: this.data.notifications.concat(list),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      });
    }

    this.setData({
      loadingStatus: false,
    });

    wx.hideNavigationBarLoading();
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    this.setData({
      notifications: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    });

    await this.loadFresnsPageData();
    wx.stopPullDownRefresh();
  },

  /** 监听用户上拉触底 **/
  onReachBottom: async function () {
    await this.loadFresnsPageData();
  },

  // 标记已读
  onMarkRead(id) {
    const notifications = this.data.notifications;
    if (!notifications) {
      return;
    }

    const idx = notifications.findIndex((value) => value.id === id);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    notifications[idx].readStatus = true;

    this.setData({
      notifications: notifications,
    });
  },
});
