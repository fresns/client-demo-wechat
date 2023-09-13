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
    type: 'wechat',
    fresnsLang: {},
    showConnectTip: false,
    btnLoading: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    this.setData({
      type: options.type,
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

    const type = this.data.type;
    switch (type) {
      case 'wechat':
        await fresnsLogin.wechatLogin(true);
        break;

      case 'app':
        await fresnsLogin.appWechatLogin(true);
        break;

      case 'apple':
        await fresnsLogin.appleLogin(true);
        break;

      default:
    }

    wx.hideNavigationBarLoading();
  },
});
