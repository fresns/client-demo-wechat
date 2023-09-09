/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang, fresnsAccount } from '../../api/tool/function';
import { callPrevPageFunction } from '../../utils/fresnsUtilities';

const Type = {
  Phone: '0',
  Email: '1',
};

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/loginInterceptor'),
    require('../../mixins/sendVerifyCode'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    fresnsConfig: null,
    fresnsLang: null,
    fresnsAccount: null,

    // 验证码
    hasAccount: null,
    type: Type.Phone,
    account: null,
    verifyCode: '',
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsLang('accountDelete'),
    });

    const countryCode = await fresnsAccount('detail.countryCode');
    const purePhone = await fresnsAccount('detail.purePhone');
    const email = await fresnsAccount('detail.email');

    const hasAccount = !!purePhone || !!email;

    let type = Type.Phone;
    let account = '+' + countryCode + ' ' + purePhone;
    if (!purePhone) {
      type = Type.Email;
      account = email;
    }

    this.setData({
      title: await fresnsLang('accountDelete'),
      fresnsConfig: await fresnsConfig(),
      fresnsLang: await fresnsLang(),
      fresnsAccount: await fresnsAccount('detail'),
      hasAccount: hasAccount,
      type: type,
      account: account,
    });
  },

  /** 重新加载账号详情 **/
  reloadFresnsAccount: async function () {
    console.log('fresnsAccount');
    wx.removeStorageSync('fresnsAccount');

    this.setData({
      fresnsAccount: await fresnsAccount('detail'),
    });
  },

  onCloseTip() {
    this.setData({
      hasAccount: !this.data.hasAccount,
    });
  },

  // 修改账号类型
  onTypeChange: function (e) {
    const fresnsAccount = this.data.fresnsAccount;

    const phone = '+' + fresnsAccount.countryCode + ' ' + fresnsAccount.purePhone;
    const email = fresnsAccount.email;

    let account = phone;
    if (e.detail.value == Type.Email) {
      account = email;
    }

    this.setData({
      type: e.detail.value,
      account: account,
      verifyCode: '',
    });
  },
  onVerifyCodeChange: function (e) {
    const value = e.detail.value;
    this.setData({
      verifyCode: value,
    });
  },

  // 发送验证码
  sendVerifyCode: async function (e) {
    const type = this.data.type;

    let params = null;
    if (type === Type.Email) {
      params = {
        type: 'email',
        useType: 4, // 4.身份验证
        templateId: 8, // 8.使用验证码注销账号
      };
    } else {
      params = {
        type: 'sms',
        useType: 4, // 4.身份验证
        templateId: 8, // 8.使用验证码注销账号
      };
    }

    this.fresnsSend(params.type, params.useType, params.templateId);
  },

  // 提交申请注销
  onSubmit: async function () {
    const { fresnsLang, type, verifyCode } = this.data;

    if (!verifyCode) {
      wx.showToast({
        title: fresnsLang.verifyCode + ': ' + fresnsLang.errorEmpty, // 验证码: 不能为空
        icon: 'none',
      });
      return;
    }

    let params = null;
    if (type === Type.Phone) {
      params = {
        verifyCode: verifyCode,
        codeType: 'sms',
      };
    }
    if (type === Type.Email) {
      params = {
        verifyCode: verifyCode,
        codeType: 'email',
      };
    }

    const applyRes = await fresnsApi.account.accountApplyDelete(params);
    if (applyRes.code === 0) {
      wx.showToast({
        title: applyRes.message,
      });

      this.reloadFresnsAccount();

      // 请求上一页 reloadFresnsAccount
      callPrevPageFunction('reloadFresnsAccount');
    }
  },

  // 撤销注销
  onSubmitRecall: async function () {
    const recallRes = await fresnsApi.account.accountRecallDelete();

    if (recallRes.code === 0) {
      wx.showToast({
        title: recallRes.message,
      });

      this.reloadFresnsAccount();

      // 请求上一页 reloadFresnsAccount
      callPrevPageFunction('reloadFresnsAccount');
    }
  },
});
