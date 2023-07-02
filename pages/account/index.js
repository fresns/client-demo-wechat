/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLogin } from '../../utils/fresnsLogin';
import { fresnsConfig, fresnsLang, fresnsAccount, fresnsUser, fresnsUserPanel } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/themeChanged')],

  /** 页面的初始数据 **/
  data: {
    accountLogin: false,
    userLogin: false,

    showLangActionSheet: false,
    langGroups: [],

    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,
    fresnsUser: null,
    fresnsUserPanel: null,

    showLogoutDialog: false,
    loginButtons: [],
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account'),
    });

    const langArr = await fresnsConfig('language_menus');

    const langGroups = langArr
      .filter((item) => item.isEnabled)
      .map((item) => {
        let text = item.langName;
        if (item.areaName) {
          text = item.langName + ' (' + item.areaName + ')';
        }

        const newItem = {
          text: text,
          value: item.langTag,
        };

        if (item.langTag === globalInfo.langTag) {
          newItem.type = 'warn';
        }

        return newItem;
      });

    this.setData({
      accountLogin: globalInfo.accountLogin,
      userLogin: globalInfo.userLogin,
      fresnsConfig: await fresnsConfig(),
      fresnsLang: await fresnsLang(),
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsUserPanel: await fresnsUserPanel(),
      langGroups: langGroups,
      loginButtons: [
        {
          text: await fresnsLang('cancel'),
        },
        {
          text: await fresnsLang('confirm'),
          extClass: 'warn',
        },
      ],
    });
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    wx.showNavigationBarLoading();
    console.log('reload data start');

    wx.removeStorageSync('fresnsAccount');
    wx.removeStorageSync('fresnsUser');
    wx.removeStorageSync('fresnsUserPanel');

    this.setData({
      fresnsAccount: await fresnsAccount('detail'),
      fresnsUser: await fresnsUser('detail'),
      fresnsUserPanel: await fresnsUserPanel(),
    });

    wx.stopPullDownRefresh();

    wx.hideNavigationBarLoading();
    console.log('reload data end');
  },

  /** 切换语言菜单 **/
  showLanguageSheet: function (e) {
    this.setData({
      showLangActionSheet: true,
    });
  },

  /** 切换语言操作 **/
  langBtnClick: function (e) {
    wx.setStorageSync('langTag', e.detail.value);

    this.setData({
      showLangActionSheet: false,
    });

    wx.redirectTo({
      url: '/pages/account/index',
    });
  },

  /** 退出登录 **/
  onClickLogout: function () {
    this.setData({
      showLogoutDialog: true,
    });
  },

  /** 确认退出登录 **/
  onConfirmLogout: async function (e) {
    console.log(e);

    if (e.detail.index === 1) {
      await fresnsLogin.logout();
    }

    this.setData({
      showLogoutDialog: false,

      accountLogin: false,
      userLogin: false,

      fresnsAccount: null,
      fresnsUser: null,
      fresnsUserPanel: null,
    });
  },
});
