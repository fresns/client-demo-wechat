/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { getPluginAuthorization } from '../api/tool/helper';
import { repPluginUrl } from '../utils/fresnsUtilities';

const app = getApp();

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../mixins/themeChanged'),
  ],

  /** 页面的初始数据 **/
  data: {
    url: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    console.log('web-view options', options);

    let extensionsTitle = options.title || app.globalData.extensionsTitle;
    let extensionsUrl = options.url || app.globalData.extensionsUrl;

    const fresnsExtensions = app.globalData.fresnsExtensions;

    if (!extensionsTitle) {
      extensionsTitle = fresnsExtensions.title || '';
    }

    wx.setNavigationBarTitle({
      title: extensionsTitle,
    });

    if (!extensionsUrl) {
      const url = fresnsExtensions.url;

      const urlParams = {
        authorization: await getPluginAuthorization(),
        type: fresnsExtensions.type || '',
        scene: fresnsExtensions.scene || '',
        postMessageKey: fresnsExtensions.postMessageKey || '',
        callbackUlid: fresnsExtensions.callbackUlid || '',
        aid: fresnsExtensions.aid || '',
        uid: fresnsExtensions.uid || '',
        rid: fresnsExtensions.rid || '',
        gid: fresnsExtensions.gid || '',
        pid: fresnsExtensions.pid || '',
        cid: fresnsExtensions.cid || '',
        fid: fresnsExtensions.fid || '',
        eid: fresnsExtensions.eid || '',
        plid: fresnsExtensions.plid || '',
        clid: fresnsExtensions.clid || '',
        connectPlatformId: fresnsExtensions.connectPlatformId || '',
        uploadInfo: fresnsExtensions.uploadInfo || '',
        locationInfo: fresnsExtensions.locationInfo || '',
      };

      const newUrl = repPluginUrl(url, urlParams);

      extensionsUrl = newUrl;
    }

    console.log('fresnsExtensions', extensionsUrl);

    this.setData({
      url: extensionsUrl,
    });
  },

  /** 监听页面隐藏 **/
  onHide: function () {
    app.globalData.fresnsExtensions = {};
    app.globalData.extensionsUrl = '';
    app.globalData.extensionsTitle = '';
  },

  /** 监听页面退出 **/
  onUnload: function () {
    app.globalData.fresnsExtensions = {};
    app.globalData.extensionsUrl = '';
    app.globalData.extensionsTitle = '';
  },

  /** 回调消息 **/
  fresnsCallback: function (e) {
    console.log('fresnsCallback', e);

    const messageData = e.detail.data[0];

    const fresnsCallback = JSON.parse(messageData);

    wx.setStorageSync('fresnsCallback', fresnsCallback);
  },
});
