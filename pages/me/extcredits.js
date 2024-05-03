/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

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
    id: null,
    // 当前页面数据
    extcredits1Name: null,
    extcredits2Name: null,
    extcredits3Name: null,
    extcredits4Name: null,
    extcredits5Name: null,

    // 当前分页数据
    logs: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const id = options.id;

    let title = await fresnsConfig('channel_me_extcredits_name');
    if (id) {
      const titleKey = `extcredits${id}_name`;

      title = await fresnsConfig(titleKey);
    }

    this.setData({
      title: title,
      fresnsLang: await fresnsLang(),
      id: id,
      extcredits1Name: await fresnsConfig('extcredits1_name'),
      extcredits2Name: await fresnsConfig('extcredits2_name'),
      extcredits3Name: await fresnsConfig('extcredits3_name'),
      extcredits4Name: await fresnsConfig('extcredits4_name'),
      extcredits5Name: await fresnsConfig('extcredits5_name'),
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

    const resultRes = await fresnsApi.user.extcreditsRecords({
      extcreditsId: this.data.id,
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data;
      const isReachBottom = pagination.currentPage === pagination.lastPage;

      const listCount = list.length + this.data.logs.length;

      let tipType = 'none';
      if (isReachBottom) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      this.setData({
        logs: this.data.logs.concat(list),
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
      logs: [],
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
    console.log('滚动到底部');
    await this.loadFresnsPageData();
  },
});
