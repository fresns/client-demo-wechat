/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { truncateText, callPrevPageFunction } from '../../utils/fresnsUtilities';

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
    // 详情
    title: null,
    post: null,
    loadingDetailStatus: true,
    commentName: null,

    // 评论框
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
      title: await fresnsConfig('post_name'),
    });

    this.setData({
      query: options,
      commentName: await fresnsConfig('comment_name'),
    });

    const postDetailRes = await fresnsApi.post.postDetail({
      pid: options.pid,
    });

    if (postDetailRes.code === 0) {
      const userDeactivate = await fresnsLang('userDeactivate');
      const authorAnonymous = await fresnsLang('contentAuthorAnonymous');
      const post = postDetailRes.data.detail;

      let postTitle = post.title || truncateText(post.content, 20);
      let nickname = post.author.nickname;

      if (!post.author.status) {
        nickname = userDeactivate;
      } else if (post.isAnonymous) {
        nickname = authorAnonymous;
      }

      this.setData({
        post: post,
        loadingDetailStatus: false,
        title: nickname + ': ' + postTitle,
        commentBtnName: await fresnsConfig('publish_comment_name'),
      });

      // 替换上一页数据
      // mixins/fresnsInteraction.js
      callPrevPageFunction('onChangePost', post);
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

    const commentsRes = await fresnsApi.comment.commentList(
      Object.assign(this.data.query, {
        orderDirection: 'asc',
        whitelistKeys:
          'cid,url,content,contentLength,isBrief,isMarkdown,isAnonymous,isSticky,digestState,createdTimeAgo,editedTimeAgo,likeCount,dislikeCount,commentCount,moreJson,location,files,isCommentPrivate,author.fsid,author.uid,author.username,author.nickname,author.avatar,author.decorate,author.verifiedStatus,author.nicknameColor,author.roleName,author.roleNameDisplay,author.status,author.isPostAuthor,manages,editControls,interaction,replyToPost.pid,replyToPost.author.avatar,replyToPost.author.nickname,replyToPost.author.status,replyToPost.isAnonymous,replyToPost.content,replyToPost.group.gname,subComments.0.author.status,subComments.0.author.fsid,subComments.0.author.nickname,subComments.0.isAnonymous,subComments.0.content,subComments.1.author.status,subComments.1.author.fsid,subComments.1.author.nickname,subComments.1.isAnonymous,subComments.1.content,subComments.2.author.status,subComments.2.author.fsid,subComments.2.author.nickname,subComments.2.isAnonymous,subComments.2.content,subComments.3.author.status,subComments.3.author.fsid,subComments.3.author.nickname,subComments.3.isAnonymous,subComments.3.content,subComments.4.author.status,subComments.4.author.fsid,subComments.4.author.nickname,subComments.4.isAnonymous,subComments.4.content',
        page: this.data.page,
      })
    );

    if (commentsRes.code === 0) {
      const { paginate, list } = commentsRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;

      const listCount = list.length + this.data.comments.length;

      let tipType = 'none';
      if (isReachBottom) {
        tipType = listCount > 0 ? 'page' : 'empty';
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
    // 防抖判断
    if (isRefreshing) {
      wx.stopPullDownRefresh();
      return;
    }

    isRefreshing = true;

    this.setData({
      comments: [],
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

  // 评论
  onClickCreateComment: function () {
    this.selectComponent('#postComponent').triggerComment();
  },
});
