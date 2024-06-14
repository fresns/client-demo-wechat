/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services/api';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { clearCache } from '../../sdk/helpers/cache';
import { callPrevPageFunction, callPrevPageComponentMethod } from '../../sdk/utilities/toolkit';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../mixins/fresnsInteraction'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    userDeactivated: null,

    // 当前分页数据
    conversations: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    this.setData({
      title: await fresnsConfig('channel_conversations_name'),
      userDeactivated: await fresnsLang('userDeactivated'),
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

    const resultRes = await fresnsApi.conversation.list({
      filterUserType: 'whitelist',
      filterUserKeys: 'fsid,uid,username,nickname,nicknameColor,avatar,status',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data;
      const isReachBottom = pagination.currentPage === pagination.lastPage;

      const listCount = list.length + this.data.conversations.length;

      let tipType = 'none';
      if (isReachBottom) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      // 处理内容截断
      const modifiedList = list.map((item) => {
        if (item.latestMessage.message.length > 40) {
          item.latestMessage.message = item.latestMessage.message.slice(0, 40) + '...';
        }
        return item;
      });

      this.setData({
        conversations: this.data.conversations.concat(modifiedList),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      });
    }

    this.setData({
      refresherStatus: false,
      loadingStatus: false,
    });
  },

  /** 监听用户下拉动作 **/
  onRefresherRefresh: async function () {
    if (isRefreshing) {
      console.log('下拉', '防抖');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

    this.setData({
      conversations: [],
      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingTipType: 'none',
    });

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  /** 监听用户上拉触底 **/
  onScrollToLower: async function () {
    if (isRefreshing) {
      console.log('上拉', '防抖');

      return;
    }

    isRefreshing = true;

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  // 标记已读
  onMarkRead(fsid) {
    const conversations = this.data.conversations;
    if (conversations.length < 1) {
      return;
    }

    const idx = conversations.findIndex((value) => value.user.fsid == fsid);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    const unreadCount = conversations[idx].unreadCount;

    conversations[idx].unreadCount = 0;

    this.setData({
      conversations: conversations,
    });

    clearCache('fresnsCacheOverviewTags');

    callPrevPageFunction('onChangeUnreadNotifications');
    callPrevPageComponentMethod('#fresnsTabbar', 'onChangeUnreadNotifications', unreadCount);
  },
});
