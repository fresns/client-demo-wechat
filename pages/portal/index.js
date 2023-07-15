/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/themeChanged'), require('../../mixins/checkSiteMode')],

  /** 页面的初始数据 **/
  data: {
    title: null,
    content: null,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_portal_title'),
    });

    const value = (await fresnsConfig('portal_8')) || 'null';

    this.setData({
      title: await fresnsConfig('menu_portal_title'),
      content: value,
    });
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: this.data.title,
    };
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: this.data.title,
    };
  },

  /** 右上角菜单-收藏 **/
  onAddToFavorites: function () {
    return {
      title: this.data.title,
    };
  },
});
