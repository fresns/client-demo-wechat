/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsAccount } from '../../sdk/helpers/profiles';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/fresnsCallback'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    fresnsLang: null,
    fresnsAccount: null,
    recharges: [],
    withdraws: [],

    // 当前分页数据
    walletLogs: [],

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
      title: await fresnsConfig('channel_me_wallet_name'),
      fresnsLang: await fresnsLang(),
      fresnsAccount: await fresnsAccount('detail'),
      recharges: await fresnsAccount('items.walletRecharges'),
      withdraws: await fresnsAccount('items.walletWithdraws'),
    });

    this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    const resultRes = await fresnsApi.account.walletRecords({
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data;
      const isReachBottom = pagination.currentPage === pagination.lastPage;

      const listCount = list.length + this.data.walletLogs.length;

      let tipType = 'none';
      if (isReachBottom && this.data.page > 1) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      this.setData({
        walletLogs: this.data.walletLogs.concat(list),
        page: this.data.page + 1,
        isReachBottom: isReachBottom,
        loadingTipType: tipType,
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
      console.log('防抖判断');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

    this.setData({
      walletLogs: [],
      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingTipType: 'none',
    });

    this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  /** 监听用户上拉触底 **/
  onScrollToLower: async function () {
    console.log('滚动到底部');
    this.loadFresnsPageData();
  },
});
