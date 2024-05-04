/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/common')],

  /** 页面的初始数据 **/
  data: {
    title: null,
    tabs: [],
    selectedTab: 0,
    content: '',
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    let tabs = [];
    if (await fresnsConfig('account_terms_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesTerms'),
        active: 'terms',
        content: await fresnsConfig('account_terms_policy'),
      });
    }
    if (await fresnsConfig('account_privacy_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesPrivacy'),
        active: 'privacy',
        content: await fresnsConfig('account_privacy_policy'),
      });
    }
    if (await fresnsConfig('account_cookie_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesCookie'),
        active: 'cookie',
        content: await fresnsConfig('account_cookie_policy'),
      });
    }
    if (await fresnsConfig('account_delete_status')) {
      tabs.push({
        title: await fresnsLang('accountPoliciesDelete'),
        active: 'accountDelete',
        content: await fresnsConfig('account_delete_policy'),
      });
    }

    let index = 0;
    let content = '';

    if (options.active) {
      index = tabs.findIndex((tab) => tab.active == options.active);

      content = tabs[index].content;
    } else {
      content = tabs[0].content;
    }

    this.setData({
      title: await fresnsLang('accountPolicies'),
      tabs: tabs,
      selectedTab: index,
      content: content,
    });
  },

  onTapTab: function (e) {
    const index = e.currentTarget.dataset.tab;

    this.setData({
      selectedTab: index,
      content: this.data.tabs[index].content,
    });
  },
});
