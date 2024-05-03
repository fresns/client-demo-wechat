/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsClient } from '../../sdk/helpers/client';
import { fresnsLogin } from '../../sdk/helpers/login';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,

    fresnsLang: null,

    enableWeChatLogin: true,

    accountLoginService: null,
    accountRegisterStatus: false,
    accountRegisterService: null,

    appBaseInfo: {},
    wechatLoginBtnName: null,
    appleLoginBtnName: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    if (options.showToast == 'true') {
      wx.showToast({
        title: await fresnsLang('errorNoLogin', '请先登录账号再操作'),
        icon: 'none',
      });
    }

    const langTag = fresnsClient.langTag;

    const btnNameMap = {
      en: 'Sign in with WeChat',
      'zh-Hans': '通过微信登录',
      'zh-Hant': '透過 WeChat 登入',
    };
    const wechatLoginBtnName = btnNameMap[langTag] || 'Sign in with WeChat';

    const appleBtnNameMap = {
      en: 'Sign in with Apple',
      'zh-Hans': '通过 Apple 登录',
      'zh-Hant': '透過 Apple 登入',
    };
    const appleLoginBtnName = appleBtnNameMap[langTag] || 'Sign in with Apple';

    this.setData({
      title: await fresnsLang('accountLoginOrRegister'),
      fresnsLang: await fresnsLang(),
      enableWeChatLogin: fresnsClient.enableWeChatLogin,
      appBaseInfo: fresnsClient.appBaseInfo,
      wechatLoginBtnName: wechatLoginBtnName,
      appleLoginBtnName: appleLoginBtnName,
      accountLoginService: await fresnsConfig('account_login_service'),
      accountRegisterStatus: await fresnsConfig('account_register_status'),
      accountRegisterService: await fresnsConfig('account_register_service'),
    });
  },

  // 微信登录
  onWeChatLogin: async function () {
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    const loginRes = await fresnsLogin.wechatLogin();

    this.onLoginHandle('wechat', loginRes);
  },

  // App 微信登录
  onAppWeChatLogin: async function () {
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    const loginRes = await fresnsLogin.appWechatLogin();

    this.onLoginHandle('app', loginRes);
  },

  // App 微信小程序登录
  onAppWechatMiniProgramLogin: async function () {
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    const loginRes = await fresnsLogin.appWechatMiniProgramLogin();

    this.onLoginHandle('appMiniProgram', loginRes);
  },

  // 苹果账号登录
  onAppleLogin: async function () {
    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    const loginRes = await fresnsLogin.appleLogin();

    this.onLoginHandle('apple', loginRes);
  },

  // 处理登录
  onLoginHandle: async function (type, loginRes) {
    // 授权成功，但是本站并未查询到对应的账号
    if (loginRes.code == 31502) {
      wx.navigateTo({
        url: '/pages/me/wechat-login/check-sign?type=' + type,
        routeType: 'wx://bottom-sheet',
      });

      return;
    }

    wx.hideLoading();

    // 登录失败
    if (loginRes.code != 0) {
      wx.showToast({
        title: '[' + loginRes.code + '] ' + loginRes.message,
        icon: 'none',
      });

      return;
    }

    // 登录成功
    wx.navigateBack({
      // 从登录页后退
      fail() {
        // 后退失败，直接进入个人中心
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
    });
  },
});
