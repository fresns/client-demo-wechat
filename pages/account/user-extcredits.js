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
  mixins: [require('../../mixins/globalConfig'), require('../../mixins/loginInterceptor')],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,
    // 当前页面数据
    extcredits1Name: null,
    extcredits2Name: null,
    extcredits3Name: null,
    extcredits4Name: null,
    extcredits5Name: null,
    logs: [],
    // 下次请求时候的页码，初始值为 1
    id: null,
    page: 1,
    // 加载状态
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const id = options.id;

    if (id) {
      const titleKey = `extcredits${id}_name`;
      wx.setNavigationBarTitle({
        title: await fresnsConfig(titleKey),
      });
    } else {
      wx.setNavigationBarTitle({
        title: await fresnsLang('userExtcreditsLogs'),
      });
    }

    this.setData({
      fresnsLang: await fresnsLang(),
      extcredits1Name: await fresnsConfig('extcredits1_name'),
      extcredits2Name: await fresnsConfig('extcredits2_name'),
      extcredits3Name: await fresnsConfig('extcredits3_name'),
      extcredits4Name: await fresnsConfig('extcredits4_name'),
      extcredits5Name: await fresnsConfig('extcredits5_name'),
      id: id,
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    wx.showNavigationBarLoading();

    this.setData({
      loadingStatus: true,
    });

    const resultRes = await fresnsApi.user.userExtcreditsLogs({
      extcreditsId: this.data.id,
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;

      const listCount = list.length + this.data.logs.length;

      let tipType = 'none';
      if (isReachBottom) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      this.setData({
        logs: this.data.logs.concat(list),
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
    // 防抖判断
    if (isRefreshing) {
      wx.stopPullDownRefresh();
      return;
    };

    isRefreshing = true;

    this.setData({
      logs: [],
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
});
