/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import appConfig from '../../fresns';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

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
    mapUrl: null,
    mapId: 5,
    latitude: null,
    longitude: null,
    poi: '',
    select: '',
    // 当前页面数据
    posts: [],
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
      title: await fresnsConfig('menu_nearby_posts'),
    });

    const { tencentMapKey, tencentMapReferer } = appConfig;
    const deviceInfo = wx.getStorageSync('deviceInfo');

    const locationInfo = JSON.stringify({
      latitude: this.data.latitude || deviceInfo.latitude,
      longitude: this.data.longitude || deviceInfo.longitude,
    });

    const mapUrl = `plugin://chooseLocation/index?key=${tencentMapKey}&referer=${tencentMapReferer}&location=${locationInfo}`;

    this.setData({
      title: await fresnsConfig('menu_nearby_posts'),
      mapUrl: mapUrl,
      poi: await fresnsLang('location'),
      select: await fresnsLang('select'),
    });
  },

  /** 监听页面显示 **/
  onShow: async function () {
    const { tencentMapKey, tencentMapReferer } = appConfig;

    const chooseLocation = requirePlugin('chooseLocation');
    const location = chooseLocation.getLocation();

    if (!location) {
      return;
    }

    const locationInfo = JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    const mapUrl = `plugin://chooseLocation/index?key=${tencentMapKey}&referer=${tencentMapReferer}&location=${locationInfo}`;

    this.setData({
      mapUrl: mapUrl,
      mapId: 5,
      latitude: location.latitude,
      longitude: location.longitude,
      poi: location.name,
      select: await fresnsLang('reselect'),
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

    const resultRes = await fresnsApi.post.postNearby({
      mapId: this.data.mapId,
      mapLng: this.data.longitude,
      mapLat: this.data.latitude,
      whitelistKeys:
        'pid,url,title,content,contentLength,isBrief,isMarkdown,isAnonymous,stickyState,digestState,createdTimeAgo,editedTimeAgo,likeCount,dislikeCount,commentCount,readConfig,affiliatedUserConfig,moreJson,location,operations,files,group.gid,group.gname,group.cover,author.fsid,author.uid,author.username,author.nickname,author.avatar,author.decorate,author.verifiedStatus,author.nicknameColor,author.roleName,author.roleNameDisplay,author.status,previewComments,manages,editControls,interaction',
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
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
    this.setData({
      posts: [],
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
