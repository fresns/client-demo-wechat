/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { callPrevPageFunction } from '../../utils/fresnsUtilities';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/fresnsInteraction'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    fsConfig: {},
    fsLang: {},
    // 详情
    hid: null,
    hashtag: null,
    hashtagFormat: null,

    // 帖子
    query: {},
    posts: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    this.setData({
      hid: options.hid,
      query: options,
      fsConfig: {
        post_name: await fresnsConfig('post_name'),
        like_hashtag_name: await fresnsConfig('like_hashtag_name'),
        follow_hashtag_name: await fresnsConfig('follow_hashtag_name'),
      },
      fsLang: {
        contentDigest: await fresnsLang('contentDigest'),
        contentNewList: await fresnsLang('contentNewList'),
      },
    });

    const hashtagDetailRes = await fresnsApi.hashtag.hashtagDetail({
      hid: options.hid,
    });

    if (hashtagDetailRes.code === 0) {
      this.setData({
        title: hashtagDetailRes.data.detail.hname,
        hashtag: hashtagDetailRes.data.detail,
        hashtagFormat: await fresnsConfig('hashtag_format'),
      });

      wx.setNavigationBarTitle({
        title: hashtagDetailRes.data.detail.hname,
      });

      // 替换上一页数据
      // mixins/fresnsInteraction.js
      callPrevPageFunction('onChangeHashtag', hashtagDetailRes.data.detail);
    }

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

    const postsRes = await fresnsApi.post.postList(
      Object.assign(this.data.query, {
        hid: decodeURI(this.data.hid),
        page: this.data.page,
      })
    );

    if (postsRes.code === 0) {
      const { paginate, list } = postsRes.data;
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
    // 防抖判断
    if (isRefreshing) {
      wx.stopPullDownRefresh();
      return;
    };

    isRefreshing = true;

    this.setData({
      posts: [],
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
