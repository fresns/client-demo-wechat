/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services/api';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { callPrevPageFunction } from '../../sdk/utilities/toolkit';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../mixins/fresnsInteraction'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    detailType: 'posts',
    postName: null,
    commentName: null,
    contentDigest: null,
    errorUnavailable: null,
    contentGroupTip: null,

    // 详情
    loadingDetailStatus: true,
    group: null,
    extensions: [],

    // 默认查询条件
    requestQuery: null,

    // 当前分页数据
    posts: [],
    comments: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    options.groups = options.gid;

    this.setData({
      title: await fresnsConfig('group_name'),
      detailType: await fresnsConfig('channel_group_detail_type'),
      postName: await fresnsConfig('post_name'),
      commentName: await fresnsConfig('comment_name'),
      contentDigest: await fresnsLang('contentDigest'),
      errorUnavailable: await fresnsLang('errorUnavailable'),
      contentGroupTip: await fresnsLang('contentGroupTip'),
      requestQuery: options,
    });

    const detailRes = await fresnsApi.group.detail(options.gid);

    if (detailRes.code === 0) {
      const group = detailRes.data.detail;

      this.setData({
        loadingDetailStatus: false,
        group: group,
        extensions: detailRes.data.items.extensions,
      });

      // 替换上一页数据
      // mixins/fresnsInteraction.js
      callPrevPageFunction('onChangeGroup', group);
    }

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

    switch (this.data.detailType) {
      case 'posts':
        const postRes = await fresnsApi.post.list(
          Object.assign(this.data.requestQuery, {
            filterType: 'blacklist',
            filterKeys: 'hashtags,previewLikeUsers',
            filterGeotagType: 'whitelist',
            filterGeotagKeys: 'gtid,name,distance,unit',
            filterAuthorType: 'whitelist',
            filterAuthorKeys:
              'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
            filterPreviewCommentType: 'whitelist',
            filterPreviewCommentKeys: 'cid,content,contentLength,likeCount,author.nickname,author.avatar,author.status,interaction.likeName',
            filterReplyToPostType: 'whitelist',
            filterReplyToPostKeys:
              'pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name',
            filterReplyToCommentType: 'whitelist',
            filterReplyToCommentKeys:
              'cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status',
            page: this.data.page,
          })
        );

        if (postRes.code === 0) {
          const { pagination, list } = postRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

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
        break;

      case 'comments':
        const commentRes = await fresnsApi.comment.list(
          Object.assign(this.data.requestQuery, {
            filterType: 'blacklist',
            filterKeys: 'hashtags,previewLikeUsers',
            filterGeotagType: 'whitelist',
            filterGeotagKeys: 'gtid,name,distance,unit',
            filterAuthorType: 'whitelist',
            filterAuthorKeys:
              'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
            filterPreviewCommentType: 'whitelist',
            filterPreviewCommentKeys: 'cid,content,contentLength,author.nickname,author.avatar,author.status',
            filterReplyToPostType: 'whitelist',
            filterReplyToPostKeys:
              'pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name',
            filterReplyToCommentType: 'whitelist',
            filterReplyToCommentKeys:
              'cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status',
            page: this.data.page,
          })
        );

        if (commentRes.code === 0) {
          const { pagination, list } = commentRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

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
        break;

      default:
        return;
    }

    this.setData({
      refresherStatus: false,
      loadingStatus: false,
    });
  },

  /** 监听用户下拉动作 **/
  onRefresherRefresh: async function () {
    if (isRefreshing) {
      console.log('下拉', '防抖');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

    this.setData({
      posts: [],
      comments: [],
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
    if (isRefreshing) {
      console.log('上拉', '防抖');

      return;
    }

    isRefreshing = true;

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },
});
