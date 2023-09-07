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
    require('../../mixins/checkSiteMode'),
    require('../../mixins/sendVerifyCode'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    showPrivacy: false,
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
    checkPolicies: false,

    // 昵称
    nicknameName: null,
    nickname: '',
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_register'),
    });

    // 判断隐私授权
    if (wx.canIUse('getPrivacySetting')) {
      wx.getPrivacySetting({
        success: (res) => {
          if (res.needAuthorization) {
            // 需要弹出隐私协议
            this.setData({
              showPrivacy: true,
            });
          }
        },
      });
    }

    const [defaultCode, codeArray] = await Promise.all([
      fresnsConfig('send_sms_default_code'),
      fresnsConfig('send_sms_supported_codes'),
    ]);
    const countryCodeRange = codeArray.length === 1 ? [defaultCode] : codeArray;

    this.setData({
      fresnsLang: await fresnsLang(),
      nicknameName: await fresnsConfig('user_nickname_name'),
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
        useType: 1, // 1.新账号验证
        templateId: 2, // 2.注册新账号
        account: emailAddress,
        countryCode: null,
      };
    } else {
      params = {
        type: 'sms',
        useType: 1, // 1.新账号验证
        templateId: 2, // 2.注册新账号
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
  onNicknameChange: function (e) {
    const value = e.detail.value;
    this.setData({
      nickname: value,
    });
    return value;
  },
  onCheckPolicies: function (e) {
    this.setData({
      checkPolicies: !this.data.checkPolicies,
    });
  },

  // 提交注册
  onSubmit: async function () {
    wx.showNavigationBarLoading();
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
      checkPolicies,
      nickname,
    } = this.data;

    if (!checkPolicies) {
      wx.hideNavigationBarLoading();
      wx.showToast({
        title: fresnsLang.accountPoliciesError, // 请确认已经阅读并同意服务条款和隐私政策
        icon: 'none',
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.hideNavigationBarLoading();
      wx.showToast({
        title: fresnsLang.passwordAgainError, // 两次输入的密码不一致
        icon: 'none',
      });
      return;
    }

    let params = null;
    if (type === Type.Mobile) {
      params = {
        type: 'phone',
        account: phoneNumber,
        countryCode: countryCodeRange[countryCodeIndex],
        verifyCode: verifyCode,
        password: base64_encode(password),
        nickname: nickname,
      };
    }
    if (type === Type.Email) {
      params = {
        type: 'email',
        account: emailAddress,
        verifyCode: verifyCode,
        password: base64_encode(password),
        nickname: nickname,
      };
    }

    const registerRes = await fresnsApi.account.accountRegister(params);

    if (registerRes.code != 0) {
      wx.hideNavigationBarLoading();
      return;
    }

    wx.setStorageSync('aid', registerRes.data.sessionToken.aid);
    wx.setStorageSync('aidToken', registerRes.data.sessionToken.token);

    cachePut('fresnsAccount', registerRes.data, 5);

    const user = registerRes.data.detail.users[0];

    if (registerRes.data.detail.users.length > 1 || user.hasPassword) {
      wx.redirectTo({
        url: '/pages/account/users',
      });
    }

    console.log('onSubmit register');
    return await this.loginUser({
      uidOrUsername: user.uid,
    });
  },
});
