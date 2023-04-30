/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
  ],

  /** 页面的初始数据 **/
  data: {
    tabs: [],
    activeTab: 0,
    content: null,
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsLang('accountPolicies'),
    });

    let tabs = [];
    if (await fresnsConfig('account_terms_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesTerms'),
        active: 'terms',
        content: await fresnsConfig('account_terms'),
      });
    }
    if (await fresnsConfig('account_privacy_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesPrivacy'),
        active: 'privacy',
        content: await fresnsConfig('account_privacy'),
      });
    }
    if (await fresnsConfig('account_cookies_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesCookies'),
        active: 'cookies',
        content: await fresnsConfig('account_cookies'),
      });
    }
    if (await fresnsConfig('account_delete_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesDelete'),
        active: 'accountDelete',
        content: await fresnsConfig('account_delete'),
      });
    }

    const index = tabs.findIndex(tab => tab.active === options.active);

    this.setData({
      tabs: tabs,
      activeTab: index,
      content: tabs[index].content
    })
  },

  onClickTab: async function (e) {
    this.setData({
      content: this.data.tabs[e.detail.index].content
    })
  }
});