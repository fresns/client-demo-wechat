/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../sdk/helpers/configs';
import { fresnsLogin } from '../../../sdk/helpers/login';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../../mixins/common'), require('../../../mixins/fresnsCallback')],

  /** 页面的初始数据 **/
  data: {
    type: 'wechat',
    fresnsLang: {},
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    this.setData({
      type: options.type,
      fresnsLang: await fresnsLang(),
    });
  },

  /** 我有账号，绑定关联 **/
  onConnectTip: async function () {
    wx.showModal({
      title: await fresnsLang('accountConnectLinkedTip'), // 请先使用「密码」或者「验证码」登录账号，登录后在设置页进入账户中心绑定关联。
      cancelText: await fresnsLang('close'), // 关闭
      confirmText: await fresnsLang('accountLoginGoTo'), // 前往登录
      success: async (res) => {
        // 前往登录
        if (res.confirm) {
          // 扩展 Web-View 数据
          const navigatorData = {
            title: await fresnsLang('accountLogin'),
            url: await fresnsConfig('account_login_service'),
            postMessageKey: 'fresnsAccountSign',
          };

          // 将链接数据赋予到全局数据中
          const app = getApp();
          app.globalData.navigatorData = navigatorData;

          // 访问扩展页面选择用户
          wx.redirectTo({
            url: '/sdk/extensions/webview',
          });
        }
      },
    });
  },

  /** 没有账号，创建新账号 **/
  goToRegister: async function () {
    wx.showLoading({
      title: await fresnsLang('inProgress'), // 处理中
    });

    const type = this.data.type;
    let registerRes;

    switch (type) {
      case 'wechat':
        registerRes = await fresnsLogin.wechatLogin(true);
        break;

      case 'app':
        registerRes = await fresnsLogin.appWechatLogin(true);
        break;

      case 'appMiniProgram':
        registerRes = await fresnsLogin.appWechatMiniProgramLogin(true);
        break;

      case 'apple':
        registerRes = await fresnsLogin.appleLogin(true);
        break;

      default:
        wx.hideLoading();
        wx.showToast({
          title: 'type 参数不正确',
          icon: 'none',
        });
    }

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

    // 创建成功并登录
    wx.navigateBack({
      delta: 2,
      fail() {
        // 后退失败，直接进入个人中心
        wx.reLaunch({
          url: '/pages/me/index',
        });
      },
    });
  },
});
