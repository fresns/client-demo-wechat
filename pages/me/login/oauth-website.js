/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../sdk/services';
import { fresnsLang } from '../../../sdk/helpers/configs';
import { fresnsLogin } from '../../../sdk/helpers/login';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../../mixins/common'), require('../../../mixins/fresnsCallback')],

  /** 页面的初始数据 **/
  data: {
    ulid: '',
    fresnsLang: {},

    showOptionsTip: false,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const ulid = options.scene;
    console.log('[Website Auth] ULID', ulid);

    this.setData({
      ulid: ulid,
      fresnsLang: await fresnsLang(),
    });

    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中...
    });

    wx.login({
      success: async (res) => {
        const wechatCode = res.code;
        console.log('[Website Auth] WeChat Code', wechatCode);

        const authRes = await fresnsApi.plugins.wechatLogin.oauthWebsite({
          code: wechatCode,
          ulid: ulid,
        });

        if (authRes.code != 0) {
          this.setData({
            showOptionsTip: true,
          });

          return;
        }

        // 微信自动登录
        await fresnsLogin.wechatLogin();

        // 创建成功并登录
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
    });
  },

  /** 我有账号，绑定关联 **/
  onConnectTip: async function () {
    wx.showModal({
      title: await fresnsLang('accountConnectLinkedTip'), // 请先使用「密码」或者「验证码」登录账号，登录后在设置页进入账户中心绑定关联。
      showCancel: false,
      confirmText: await fresnsLang('know'),
    });
  },

  /** 没有账号，创建新账号 **/
  goToRegister: async function () {
    wx.showLoading({
      title: await fresnsLang('inProgress'), // 处理中
    });

    wx.login({
      success: async (res) => {
        const wechatCode = res.code;
        console.log('[Website Auth] WeChat Code', wechatCode);

        const registerRes = await fresnsApi.plugins.wechatLogin.oauthWebsite({
          code: wechatCode,
          ulid: this.data.ulid,
          autoRegister: true,
        });

        // 创建失败
        if (registerRes.code != 0) {
          wx.hideLoading();

          wx.showToast({
            title: '[' + registerRes.code + '] ' + registerRes.message,
            icon: 'none',
            duration: 3000,
          });

          return;
        }

        // 微信自动登录
        await fresnsLogin.wechatLogin();

        // 创建成功并登录
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
    });
  },
});
