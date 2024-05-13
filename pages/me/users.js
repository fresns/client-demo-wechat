/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';
import { fresnsAccount, fresnsOverview } from '../../sdk/helpers/profiles';
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
    users: [],
    fresnsOverviews: {},
    fresnsLang: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    if (options.showToast == 'true') {
      wx.showToast({
        title: await fresnsLang('errorNoLogin', '请先登录账号再操作'),
        icon: 'none',
      });
    }

    const users = await fresnsAccount('detail.users');

    const uidResults = {};

    for (const user of users) {
      const uidResult = await fresnsOverview(null, user.uid);
      uidResults[user.uid] = uidResult;
    }

    this.setData({
      title: await fresnsConfig('channel_me_users_name'),
      users: users,
      fresnsOverviews: uidResults,
      fresnsLang: await fresnsLang(),
    });
  },

  // 选择用户
  selectUserUser: async function (e) {
    const { user } = e.currentTarget.dataset;

    if (user.hasPin) {
      wx.showModal({
        title: user.nickname,
        editable: true,
        placeholderText: await fresnsLang('userPin'),
        success: async (res) => {
          if (res.confirm) {
            wx.showLoading({
              title: await fresnsLang('accountLoggingIn'), // 登录中
            });

            const pinLoginRes = await fresnsLogin.switchUser(user.uid, res.content);

            if (pinLoginRes.code) {
              wx.hideLoading();

              return;
            }

            // 登录成功
            wx.reLaunch({
              url: '/pages/me/index',
            });
          }
        },
      });

      return;
    }

    wx.showLoading({
      title: await fresnsLang('accountLoggingIn'), // 登录中
    });

    const loginRes = await fresnsLogin.switchUser(user.uid);

    if (loginRes.code) {
      wx.hideLoading();

      return;
    }

    // 登录成功
    wx.reLaunch({
      url: '/pages/me/index',
    });
  },
});
