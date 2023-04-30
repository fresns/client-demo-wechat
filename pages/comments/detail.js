/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { truncateText } from '../../utils/fresnsUtilities';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
  ],

  /** 页面的初始数据 **/
  data: {
    // 详情
    title: null,
    comment: null,

    // 评论框
    showCommentBox: false,
    commentBtnName: null,

    // 评论列表
    query: {},
    comments: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('comment_name'),
    });

    this.setData({
      query: options,
    })

    const commentDetailRes = await fresnsApi.comment.commentDetail({
      cid: options.cid,
    })

    if (commentDetailRes.code === 0) {
      const creatorDeactivate = await fresnsLang('contentCreatorDeactivate');
      const creatorAnonymous = await fresnsLang('contentCreatorAnonymous');
      const comment = commentDetailRes.data.detail;

      let commentTitle = truncateText(comment.content, 20);
      let nickname = comment.creator.nickname;

      if (! comment.creator.status) {
        nickname = creatorDeactivate;
      } else if (comment.isAnonymous) {
        nickname = creatorAnonymous;
      };

      this.setData({
        comment: comment,
        title: nickname + ': ' + commentTitle,
        commentBtnName: await fresnsConfig('publish_comment_name'),
      })
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

    const commentsRes = await fresnsApi.comment.commentList(Object.assign(this.data.query, {
      orderDirection: 'asc',
      page: this.data.page,
    }))

    if (commentsRes.code === 0) {
      const { paginate, list } = commentsRes.data
      const isReachBottom = paginate.currentPage === paginate.lastPage
      let tipType = 'none'
      if (isReachBottom) {
        tipType = this.data.comments.length > 0 ? 'page' : 'empty'
      }

      this.setData({
        comments: this.data.comments.concat(list),
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
      comments: [],
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

  // 评论
  onClickCreateComment() {
    this.setData({
      showCommentBox: true
    })
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: this.data.title,
    }
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: this.data.title,
    }
  },

  /** 右上角菜单-收藏 **/
  onAddToFavorites: function () {
    return {
      title: this.data.title,
    }
  },
})
