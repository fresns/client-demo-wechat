/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsConfig, fresnsViewProfile } from '../../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../../mixins/globalConfig'),
    require('../../../mixins/checkSiteMode'),
    require('../../../mixins/fresnsInteraction'),
    require('../../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    profile: null,
    title: null,
    // 当前页面数据
    posts: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 加载状态
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const viewProfile = await fresnsViewProfile(options.fsid);

    wx.setNavigationBarTitle({
      title: viewProfile.detail.nickname,
    });

    this.setData({
      profile: viewProfile,
      title: viewProfile.detail.nickname + ': ' + (await fresnsConfig('menu_profile_follow_posts')),
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

    const resultRes = await fresnsApi.user.userMarkList({
      uidOrUsername: this.data.profile.detail.uid,
      markType: 'follow',
      listType: 'posts',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;

      const listCount = list.length + this.data.posts.length;

      let tipType = 'none';
      if (isReachBottom) {
        tipType = listCount > 0 ? 'page' : 'empty';
      }

      this.setData({
        posts: this.data.posts.concat(list),
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
      posts: [],
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
});
