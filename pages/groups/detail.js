/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang, fresnsCodeMessage } from '../../api/tool/function';
import { callPrevPageFunction } from '../../utils/fresnsUtilities';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/fresnsExtensions'),
    require('../../mixins/fresnsInteraction'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    fsConfig: {},
    fsLang: {},
    // 详情
    gid: null,
    group: null,
    extensions: [],
    viewContentTip: '',

    // 置顶帖子
    stickyPosts: [],

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
    const groupDetailRes = await fresnsApi.group.groupDetail({
      gid: options.gid,
    });

    if (groupDetailRes.code === 0) {
      this.setData({
        title: groupDetailRes.data.detail.gname,
        group: groupDetailRes.data.detail,
        extensions: groupDetailRes.data.items.extensions,
      });

      wx.setNavigationBarTitle({
        title: groupDetailRes.data.detail.gname,
      });

      // 替换上一页数据
      // mixins/fresnsInteraction.js
      callPrevPageFunction('onChangeGroup', groupDetailRes.data.detail);
    }

    // 置顶帖子
    const resultRes = await fresnsApi.post.postList({
      gid: options.gid,
      stickyState: 2,
      whitelistKeys: 'pid,title,content',
    });

    let stickyPosts = [];
    if (resultRes.code === 0) {
      resultRes.data.list.forEach((post) => {
        post.shortContent = post.content.substring(0, 20);
        stickyPosts.push(post);
      });
    }

    this.setData({
      gid: options.gid,
      query: options,
      stickyPosts: stickyPosts,
      fsConfig: {
        post_name: await fresnsConfig('post_name'),
        like_group_name: await fresnsConfig('like_group_name'),
        follow_group_name: await fresnsConfig('follow_group_name'),
      },
      fsLang: {
        contentDigest: await fresnsLang('contentDigest'),
        errorUnavailable: await fresnsLang('errorUnavailable'),
        contentNewList: await fresnsLang('contentNewList'),
      },
      viewContentTip: await fresnsCodeMessage('37103'),
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

    const postsRes = await fresnsApi.post.postList(
      Object.assign(this.data.query, {
        gid: this.data.gid,
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
