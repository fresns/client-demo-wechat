/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/fresnsInteraction'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    // 当前页面数据
    comments: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 加载状态
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_follow_comments'),
    });

    this.setData({
      title: await fresnsConfig('menu_follow_comments'),
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
      uidOrUsername: globalInfo.uid,
      markType: 'follow',
      listType: 'comments',
      whitelistKeys:
        'cid,url,content,contentLength,isBrief,isMarkdown,isAnonymous,isSticky,digestState,createdTimeAgo,editedTimeAgo,likeCount,dislikeCount,commentCount,moreJson,location,files,isCommentPrivate,author.fsid,author.uid,author.username,author.nickname,author.avatar,author.decorate,author.verifiedStatus,author.nicknameColor,author.roleName,author.roleNameDisplay,author.status,manages,editControls,interaction,replyToPost.pid,replyToPost.author.avatar,replyToPost.author.nickname,replyToPost.author.status,replyToPost.isAnonymous,replyToPost.content,replyToPost.group.gname,replyToComment.author.avatar,replyToComment.author.nickname,replyToComment.author.status,replyToComment.isAnonymous,replyToComment.content,replyToComment.createdDatetime',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;
      let tipType = 'none';
      if (isReachBottom) {
        tipType = this.data.comments.length > 0 ? 'page' : 'empty';
      }

      this.setData({
        comments: this.data.comments.concat(list),
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
      comments: [],
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
