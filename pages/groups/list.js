/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig } from '../../api/tool/function';
import { parseUrlParams } from '../../utils/fresnsUtilities';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
  ],

  /** 页面的初始数据 **/
  data: {
    // 默认查询条件
    requestState: null,
    requestQuery: null,
    // 父级小组
    gid: null,
    // 当前页面数据
    groups: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 加载状态
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    let requestState = await fresnsConfig('menu_group_list_query_state');
    let requestQuery = parseUrlParams(await fresnsConfig('menu_group_list_query_config'));

    if (requestState === 3) {
      requestQuery = Object.assign(requestQuery, options);
    }

    this.setData({
      gid: options.gid,
      requestState: requestState,
      requestQuery: requestQuery,
    });

    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_group_list_title'),
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

    const resultRes = await fresnsApi.group.groupList(
      Object.assign(this.data.requestQuery, {
        gid: this.data.gid,
        whitelistKeys:
          'gid,url,type,gname,description,cover,followType,followUrl,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,interaction',
        page: this.data.page,
      })
    );

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;
      let tipType = 'none';
      if (isReachBottom) {
        tipType = this.data.groups.length > 0 ? 'page' : 'empty';
      }

      this.setData({
        groups: this.data.groups.concat(list),
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
      groups: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    });

    await this.loadFresnsPageData();
    wx.stopPullDownRefresh();
  },

  /** 监听用户上拉触底 **/
  onReachBottom: async function () {
    // 不接受客户端传参，包括分页
    if (this.data.requestState == 1) {
      this.setData({
        loadingTipType: this.data.groups.length > 0 ? 'page' : 'empty',
        isReachBottom: true,
      });
      return;
    }

    await this.loadFresnsPageData();
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: async function () {
    return {
      title: await fresnsConfig('menu_group_list_title'),
    };
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: async function () {
    return {
      title: await fresnsConfig('menu_group_list_title'),
    };
  },

  /** 右上角菜单-收藏 **/
  onAddToFavorites: async function () {
    return {
      title: await fresnsConfig('menu_group_list_title'),
    };
  },
});
