/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig } from '../../sdk/helpers/configs';
import { parseUrlParams } from '../../sdk/utilities/toolkit';

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

    // 默认查询条件
    requestState: null,
    requestQuery: null,

    // 当前分页数据
    posts: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    let requestState = await fresnsConfig('channel_post_query_state');
    let requestQuery = parseUrlParams(await fresnsConfig('channel_post_query_config'));

    if (requestState === 3) {
      requestQuery = Object.assign(requestQuery, options);
    }

    this.setData({
      title: await fresnsConfig('channel_post_name'),
      requestState: requestState,
      requestQuery: requestQuery,
    });

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

    const resultRes = await fresnsApi.post.list(
      Object.assign(this.data.requestQuery, {
        filterType: 'blacklist',
        filterKeys: 'hashtags,previewLikeUsers',
        filterGroupType: 'whitelist',
        filterGroupKeys: 'gid,name,cover',
        filterGeotagType: 'whitelist',
        filterGeotagKeys: 'gtid,name,distance,unit',
        filterAuthorType: 'whitelist',
        filterAuthorKeys:
          'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
        filterQuotedPostType: 'whitelist',
        filterQuotedPostKeys: 'pid,title,content,contentLength,author.nickname,author.avatar,author.status',
        filterPreviewCommentType: 'whitelist',
        filterPreviewCommentKeys: 'cid,content,contentLength,author.nickname,author.avatar,author.status',
        page: this.data.page,
      })
    );

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data;
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

    // 不接受客户端传参，包括分页
    if (this.data.requestState == 1) {
      this.setData({
        loadingTipType: this.data.posts.length > 0 ? 'page' : 'empty',
        isReachBottom: true,
      });
      return;
    }

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },
});
