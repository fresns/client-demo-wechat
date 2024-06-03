/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsLang } from '../../sdk/helpers/configs';

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

    // 会话详情
    configs: null,
    detail: null,

    // 当前分页数据
    messages: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const fsid = options.fsid;

    const resultRes = await fresnsApi.conversation.detail(fsid, {
      filterUserType: 'whitelist',
      filterUserKeys:'fsid,uid,username,nickname,avatar,status',
    });

    if (resultRes.code === 0) {
      this.setData({
        configs: resultRes.data.configs,
        detail: resultRes.data.detail,
      });

      let nickname = resultRes.data.detail.user.nickname;
      if (!resultRes.data.detail.user.status) {
        nickname = await fresnsLang('userDeactivated');
      }

      this.setData({
        title: nickname,
      });

      await this.loadFresnsPageData();

      return;
    }

    this.setData({
      title: await fresnsLang('errorNoInfo'),
    });
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    const detail = this.data.detail;

    const resultRes = await fresnsApi.conversation.messages(detail.user.fsid, {
      filterUserType: 'whitelist',
      filterUserKeys:'fsid,uid,username,nickname,nicknameColor,avatar,status',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data;
      const isReachBottom = pagination.currentPage === pagination.lastPage;

      this.setData({
        messages: this.data.messages.concat(list),
        page: this.data.page + 1,
        isReachBottom: isReachBottom,
      });
    }

    this.setData({
      refresherStatus: false,
      loadingStatus: false,
    });
  },

  /** 监听用户下拉触顶 **/
  onScrollToupper: async function () {
    if (isRefreshing) {
      console.log('下拉', '防抖');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

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
});
