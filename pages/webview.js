/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { getPluginAuthorization } from '../api/tool/helper';
import { repPluginUrl } from '../utils/fresnsUtilities';

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
    if (options['data-title']) {
      wx.setNavigationBarTitle({
        title: options['data-title'],
      });
    }

    const urlParams = {
      authorization: await getPluginAuthorization(),
      type: options['data-type'],
      scene: options['data-scene'],
      postMessageKey: options['data-post-message-key'],
      callbackUlid: options['data-callback-ulid'],
      aid: options['data-aid'],
      uid: options['data-uid'],
      rid: options['data-rid'],
      gid: options['data-gid'],
      pid: options['data-pid'],
      cid: options['data-cid'],
      fid: options['data-fid'],
      eid: options['data-eid'],
      plid: options['data-plid'],
      clid: options['data-clid'],
      uploadInfo: options['data-upload-info'],
    };

    const newUrl = repPluginUrl(options.url, urlParams);

    this.setData({
      url: newUrl,
    });
  },

  // 回调消息
  onMessage(e) {
    const messageData = e.detail.data[0];

    wx.setStorageSync('fresnsPluginMessage', messageData);
  },
});
