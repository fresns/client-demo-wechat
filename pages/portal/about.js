/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsClient } from '../../sdk/helpers/client';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/common')],

  /** 页面的初始数据 **/
  data: {
    logo: null,
    intro: null,

    fresnsVersion: '3.x',
    clientVersion: '3.x',
    clientName: '',
    appBaseInfo: {},
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsLang('about'),
    });

    const fresnsStatus = await fresnsApi.global.status();

    const clientNameMap = {
      5: 'iOS',
      6: 'Android',
    };
    const clientName = clientNameMap[fresnsClient.platformId] || '';

    this.setData({
      logo: await fresnsConfig('site_logo'),
      intro: await fresnsConfig('site_intro'),
      fresnsVersion: fresnsStatus.version,
      clientVersion: fresnsClient.version,
      clientName: clientName,
      appBaseInfo: fresnsClient.appBaseInfo,
    });
  },

  /** 复制公众号 **/
  tapCopyMP: function () {
    wx.setClipboardData({
      data: 'FresnsCN',
      success: function (res) {
        wx.showToast({
          title: '公众号复制成功',
        });
      },
    });
  },

  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: 'Fresns 免费开源的全端产品解决方案',
    };
  },

  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns 免费开源的全端产品解决方案',
    };
  },
});
