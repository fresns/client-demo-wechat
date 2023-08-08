/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { base64_encode } from '../../libs/base64/base64';

const Type = {
  Phone: '0',
  Email: '1',
};

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/sendVerifyCode'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,

    type: Type.Phone,

    // 邮箱地址
    emailAddress: '',

    // 手机相关信息
    countryCodeRange: [],
    countryCodeIndex: null,
    phoneNumber: '',

    // 验证码
    verifyCode: '',

    // 密码
    password: '',
    confirmPassword: '',
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_reset_password'),
    });

    const [defaultCode, codeArray] = await Promise.all([
      fresnsConfig('send_sms_default_code'),
      fresnsConfig('send_sms_supported_codes'),
    ]);
    const countryCodeRange = codeArray.length === 1 ? [defaultCode] : codeArray;

    this.setData({
      fresnsLang: await fresnsLang(),
      countryCodeRange,
      countryCodeIndex: countryCodeRange.indexOf(defaultCode),
    });
  },

  onTypeChange: function (e) {
    this.setData({
      type: e.detail.value,
      password: '',
      confirmPassword: '',
      verifyCode: '',
    });
  },
  onEmailAddressChange: function (e) {
    const value = e.detail.value;
    this.setData({
      emailAddress: value,
    });
    return value;
  },
  onCountryCodePickerChange: function (e) {
    const idxStr = e.detail.value;
    this.setData({
      countryCodeIndex: +idxStr,
    });
  },
  onPhoneNumberChange: function (e) {
    const value = e.detail.value;
    this.setData({
      phoneNumber: value,
    });
    return value;
  },
  onVerifyCodeChange: function (e) {
    const value = e.detail.value;
    this.setData({
      verifyCode: value,
    });
    return value;
  },

  // 发送验证码
  sendVerifyCode: async function (e) {
    const { type, emailAddress, countryCodeRange, countryCodeIndex, phoneNumber } = this.data;

    let params = null;
    if (type === Type.Email) {
      params = {
        type: 'email',
        useType: 2, // 2.已存账号验证
        templateId: 5, // 5.重置登录密码
        account: emailAddress,
        countryCode: null,
      };
    } else {
      params = {
        type: 'sms',
        useType: 2, // 2.已存账号验证
        templateId: 5, // 5.重置登录密码
        account: phoneNumber,
        countryCode: countryCodeRange[countryCodeIndex],
      };
    }

    this.fresnsSend(params.type, params.useType, params.templateId, params.account, params.countryCode);
  },

  onPasswordChange: function (e) {
    const value = e.detail.value;
    this.setData({
      password: value,
    });
    return value;
  },
  onConfirmPasswordChange: function (e) {
    const value = e.detail.value;
    this.setData({
      confirmPassword: value,
    });
    return value;
  },

  // 提交重置
  onSubmit: async function () {
    const {
      fresnsLang,
      type,
      emailAddress,
      countryCodeRange,
      countryCodeIndex,
      phoneNumber,
      verifyCode,
      password,
      confirmPassword,
    } = this.data;
    if (password !== confirmPassword) {
      wx.showToast({
        title: fresnsLang.passwordAgainError, // 两次输入的密码不一致
      });
      return;
    }

    let params = null;
    if (type === Type.Phone) {
      params = {
        type: 'phone',
        account: phoneNumber,
        countryCode: countryCodeRange[countryCodeIndex],
        verifyCode: verifyCode,
        newPassword: base64_encode(password),
      };
    }
    if (type === Type.Email) {
      params = {
        type: 'email',
        account: emailAddress,
        verifyCode: verifyCode,
        newPassword: base64_encode(password),
      };
    }

    const resetRes = await fresnsApi.account.accountResetPassword(params);
    if (resetRes.code === 0) {
      wx.showToast({
        title: resetRes.message,
      });
      wx.redirectTo({
        url: '/pages/account/login',
      });
    }
  },
});
