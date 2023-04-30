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
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
  ],

  /** 页面的初始数据 **/
  data: {
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
    });

    const hashtagDetailRes = await fresnsApi.hashtag.hashtagDetail({
      hid: options.hid,
    })

    if (hashtagDetailRes.code === 0) {
      this.setData({
        hashtag: hashtagDetailRes.data.detail,
        hashtagFormat: await fresnsConfig('hashtag_format'),
      });

      wx.setNavigationBarTitle({
        title: hashtagDetailRes.data.detail.hname,
      });
    }

    await this.loadFresnsPageData()
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    wx.showNavigationBarLoading();

    this.setData({
      loadingStatus: true,
    })

    const postsRes = await fresnsApi.post.postList(Object.assign(this.data.query, {
      hid: decodeURI(this.data.hid),
      page: this.data.page,
    }))

    if (postsRes.code === 0) {
      const { paginate, list } = postsRes.data
      const isReachBottom = paginate.currentPage === paginate.lastPage
      let tipType = 'none'
      if (isReachBottom) {
        tipType = this.data.posts.length > 0 ? 'page' : 'empty'
      }

      this.setData({
        posts: this.data.posts.concat(list),
        page: this.data.page + 1,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      })
    }

    this.setData({
      loadingStatus: false,
    })

    wx.hideNavigationBarLoading();
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    this.setData({
      posts: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    })

    await this.loadFresnsPageData()
    wx.stopPullDownRefresh()
  },

  /** 监听用户上拉触底 **/
  onReachBottom: async function () {
    await this.loadFresnsPageData()
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: this.data.hashtag.hname,
      imageUrl: this.data.hashtag.cover,
    }
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: this.data.hashtag.hname,
      imageUrl: this.data.hashtag.cover,
    }
  },

  /** 右上角菜单-收藏 **/
  onAddToFavorites: function () {
    return {
      title: this.data.hashtag.hname,
      imageUrl: this.data.hashtag.cover,
    }
  },
})
