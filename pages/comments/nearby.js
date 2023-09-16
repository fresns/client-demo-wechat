/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

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
    // 位置
    mapId: 5,
    latitude: null,
    longitude: null,
    poi: '',
    select: '',
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
      title: await fresnsConfig('menu_nearby_comments'),
    });

    this.setData({
      title: await fresnsConfig('menu_nearby_comments'),
      poi: await fresnsLang('location'),
      select: await fresnsLang('select'),
    });
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom || this.data.isLocation) {
      return;
    }

    wx.showNavigationBarLoading();

    this.setData({
      loadingStatus: true,
    });

    const resultRes = await fresnsApi.comment.commentNearby({
      mapId: this.data.mapId,
      mapLng: this.data.longitude,
      mapLat: this.data.latitude,
      whitelistKeys:
        'cid,url,content,contentLength,isBrief,isMarkdown,isAnonymous,isSticky,digestState,createdTimeAgo,editedTimeAgo,likeCount,dislikeCount,commentCount,moreJson,location,files,isCommentPrivate,author.fsid,author.uid,author.username,author.nickname,author.avatar,author.decorate,author.verifiedStatus,author.nicknameColor,author.roleName,author.roleNameDisplay,author.status,manages,editControls,interaction,replyToPost.pid,replyToPost.author.avatar,replyToPost.author.nickname,replyToPost.author.status,replyToPost.isAnonymous,replyToPost.content,replyToPost.group.gname,replyToComment.author.avatar,replyToComment.author.nickname,replyToComment.author.status,replyToComment.isAnonymous,replyToComment.content,replyToComment.createdDatetime',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
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

  // 选择位置
  onClickSelectLocation: function () {
    // 判断隐私授权
    if (wx.canIUse('getPrivacySetting')) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            this.setData({
              showPrivacy: true,
            });
          }
        },
        fail() {
          return;
        },
      });
    }

    const { latitude, longitude } = this.data;

    wx.chooseLocation({
      latitude: latitude,
      longitude: longitude,
      success: async (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          poi: res.name,
          select: await fresnsLang('reselect'),
          posts: [],
          page: 1,
          loadingTipType: 'none',
          isReachBottom: false,
        });

        await this.loadFresnsPageData();
      },
    });
  },
});
