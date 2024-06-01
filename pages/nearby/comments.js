/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

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

    name: null,
    select: null,

    // 位置
    mapId: 5,
    latitude: null,
    longitude: null,

    // 当前分页数据
    comments: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    this.setData({
      navbarBackButton: true,
      title: await fresnsConfig('channel_nearby_name'),
      name: await fresnsLang('location'),
      select: await fresnsLang('select'),
    });
  },

  // 选择位置
  onClickSelectLocation: function () {
    const { latitude, longitude } = this.data;

    wx.chooseLocation({
      latitude: latitude,
      longitude: longitude,
      success: async (res) => {
        console.log('chooseLocation', res);

        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          name: res.name || res.address,
          select: await fresnsLang('reselect'),

          posts: [],
          comments: [],
          page: 1,
          isReachBottom: false,
          loadingTipType: 'none',
        });

        await this.loadFresnsPageData();
      },
    });
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    const { mapId, latitude, longitude } = this.data;

    if (!latitude || !longitude) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    const commentRes = await fresnsApi.comment.nearby({
      mapId: mapId,
      mapLat: latitude,
      mapLng: longitude,
      unit: 'km',
      length: 10,
      filterType: 'blacklist',
      filterKeys: 'hashtags,previewLikeUsers',
      filterGeotagType: 'whitelist',
      filterGeotagKeys: 'gtid,name,distance,unit',
      filterAuthorType: 'whitelist',
      filterAuthorKeys: 'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
      filterPreviewCommentType: 'whitelist',
      filterPreviewCommentKeys: 'cid,content,contentLength,author.nickname,author.avatar,author.status',
      filterReplyToPostType: 'whitelist',
      filterReplyToPostKeys: 'pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name',
      filterReplyToCommentType: 'whitelist',
      filterReplyToCommentKeys: 'cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status',
      page: this.data.page,
    });

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

    this.setData({
      loadingStatus: false,
    });
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
