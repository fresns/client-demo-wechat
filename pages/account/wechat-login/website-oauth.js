/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsLogin } from '../../../utils/fresnsLogin';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../../mixins/themeChanged'),
    require('../../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    ulid: '',

    loading: true,
    showSuccessTip: false,

    failTip: '',
    showFailTip: false,

    showOptionsTip: false,
    showConnectTip: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const ulid = options.scene;
    console.log('[Website Auth] ULID', ulid);

    this.setData({
      ulid: ulid,
    });

    wx.showNavigationBarLoading();

    wx.login({
      success: async (res) => {
        let wechatCode = res.code;
        console.log('[Website Auth] WeChat Code', wechatCode);

        if (wechatCode) {
          const authRes = await fresnsApi.wechatLogin.oauthWebsite({
            code: wechatCode,
            ulid: ulid,
          });

          if (authRes.code == 0) {
            this.setData({
              loading: false,
              showSuccessTip: true,

              showFailTip: false,

              showOptionsTip: false,
              showConnectTip: false,
            });

            await fresnsLogin.wechatLogin();

            return;
          }

          this.setData({
            loading: false,
            showSuccessTip: false,

            showFailTip: false,

            showOptionsTip: true,
            showConnectTip: false,
          });

          wx.hideNavigationBarLoading();
        } else {
          this.setData({
            loading: false,
            showSuccessTip: false,

            showFailTip: true,
            failTip: res.errMsg,

            showOptionsTip: false,
            showConnectTip: false,
          });
        }
      },
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

  goToRegister: async function () {
    wx.showNavigationBarLoading();

    wx.login({
      success: async (res) => {
        let wechatCode = res.code;
        console.log('[Website Auth] WeChat Code', wechatCode);

        if (wechatCode) {
          const authRes = await fresnsApi.wechatLogin.oauthWebsite({
            code: wechatCode,
            ulid: this.data.ulid,
            autoRegister: true,
          });

          if (authRes.code == 0) {
            this.setData({
              loading: false,
              showSuccessTip: true,

              showFailTip: false,

              showOptionsTip: false,
              showConnectTip: false,
            });

            await fresnsLogin.wechatLogin();

            return;
          }

          this.setData({
            loading: false,
            showSuccessTip: false,

            showFailTip: false,

            showOptionsTip: true,
            showConnectTip: false,
          });

          wx.hideNavigationBarLoading();
        } else {
          this.setData({
            loading: false,
            showSuccessTip: false,

            showFailTip: true,
            failTip: res.errMsg,

            showOptionsTip: false,
            showConnectTip: false,
          });
        }
      },
    });
  },
});
