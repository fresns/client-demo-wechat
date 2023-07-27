/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsCodeMessage, fresnsAccount, fresnsUserPanels } from '../../api/tool/function';
import { fresnsLogin } from '../../utils/fresnsLogin';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,

    users: [],
    userPanels: {},

    // 密码输入框是否可见
    isPasswordDialogVisible: false,
    // 输入的密码
    password: '',
    currentUser: '',
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_users'),
    });

    const users = await fresnsAccount('detail.users');
    const userPanels = await fresnsUserPanels();

    this.setData({
      users: users,
      userPanels: userPanels,
    });

    if (options.showToast === 'true') {
      wx.showToast({
        title: (await fresnsCodeMessage('31601')) || '请先登录用户再操作',
        icon: 'none',
      });
    }
  },

  // 选择用户
  selectUserUser: async function (e) {
    const { user } = e.currentTarget.dataset;
    if (user.hasPassword) {
      this.setData({
        isPasswordDialogVisible: true,
        currentUser: user,
      });
    } else {
      console.log('selectUserUser');

      await fresnsLogin.loginUser({
        uidOrUsername: user.uid,
      });
      wx.redirectTo({
        url: '/pages/account/index',
      });
    }
  },

  // 密码修改监听函数
  onInputPassword: function (e) {
    const { value } = e.detail;
    this.setData({
      password: value,
    });
    return value;
  },

  // 提交密码
  onSubmitPassword: async function (e) {
    const { currentUser } = this.data;
    try {
      console.log('onSubmitPassword');

      const selectUserRes = await fresnsLogin.loginUser({
        uidOrUsername: currentUser.uid,
        password: this.data.password,
      });

      if (selectUserRes.code === 0) {
        this.setData({
          isPasswordDialogVisible: false,
          password: '',
        });

        wx.redirectTo({
          url: '/pages/user/index',
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  },
});
