/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { fresnsLogin } from '../../../utils/fresnsLogin';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../../mixins/globalConfig'), require('../../../mixins/fresnsExtensions')],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: {},
    showConnectTip: false,
    btnLoading: false,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    this.setData({
      fresnsLang: await fresnsLang(),
    });
  },

  /** 交互操作 **/
  onConnectTip() {
    this.setData({
      showConnectTip: true,
    });
  },

  tipClose() {
    this.setData({
      showConnectTip: false,
    });
  },

  goToLogin() {
    wx.redirectTo({
      url: '/pages/account/login',
    });
  },

  goToRegister: async function () {
    wx.showNavigationBarLoading();

    this.setData({
      btnLoading: true,
    });

    await fresnsLogin.wechatLogin(true);

    wx.hideNavigationBarLoading();
  },
});
