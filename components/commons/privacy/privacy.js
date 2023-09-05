/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';
import { getCurrentPagePath, callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    showPrivacy: Boolean,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsConfig: {},
    fresnsLang: {},
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsConfig: {
          account_terms_status: await fresnsConfig('account_terms_status'),
          account_privacy_status: await fresnsConfig('account_privacy_status'),
        },
        fresnsLang: {
          accountPoliciesTerms: await fresnsLang('accountPoliciesTerms'),
          accountPoliciesPrivacy: await fresnsLang('accountPoliciesPrivacy'),
          accountPoliciesAuthTip: await fresnsLang('accountPoliciesAuthTip'),
          accountPoliciesAuthDesc: await fresnsLang('accountPoliciesAuthDesc'),
          agreeAuth: await fresnsLang('agreeAuth'),
          disagree: await fresnsLang('disagree'),
        },
      });
    },
  },

  /** 组件功能 **/
  methods: {
    handleOpenPrivacyContract() {
      // 打开隐私协议页面
      wx.openPrivacyContract();
    },

    closePrivacy() {
      this.setData({
        showPrivacy: false,
      });

      const currentPagePath = getCurrentPagePath();

      if (
        currentPagePath == 'pages/editor/index' ||
        currentPagePath == 'pages/account/login' ||
        currentPagePath == 'pages/account/register'
      ) {
        callPageFunction('navigateBack');
      }
    },

    handleAgreePrivacyAuthorization() {
      this.setData({
        showPrivacy: false,
      });
    },
  },
});
