/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
  ],

  /** 页面的初始数据 **/
  data: {
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_search'),
    });
  },
})