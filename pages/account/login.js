/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { fresnsLogin } from '../../utils/fresnsLogin';
import { base64_encode } from '../../libs/base64/base64';

const LoginType = {
  WeChat: '0',
  Password: '1',
  VerifyCode: '2',
};

const Type = {
  Phone: '0',
  Email: '1',
};

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/themeChanged'), require('../../mixins/sendVerifyCode')],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,
    wechatLoginBtnName: null,

    codeLogin: false,
    switchLogin: false,

    loginType: LoginType.WeChat,
    type: Type.Phone,

    btnLoading: false,

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
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_login'),
    });

    const [defaultCode, codeArray] = await Promise.all([
      fresnsConfig('send_sms_default_code'),
      fresnsConfig('send_sms_supported_codes'),
    ]);
    const countryCodeRange = codeArray.length === 1 ? [defaultCode] : codeArray;

    const emailLogin = Boolean(await fresnsConfig('site_email_login'));
    const phoneLogin = Boolean(await fresnsConfig('site_phone_login'));

    let loginType = Type.Phone;
    if (!emailLogin || !phoneLogin) {
      loginType = phoneLogin ? Type.Phone : Type.Email;
    }

    const storageLangTag = wx.getStorageSync('langTag');
    const btnNameMap = {
      en: 'Continue with WeChat',
      'zh-Hans': '使用微信登录',
      'zh-Hant': '使用 WeChat 登錄',
    };
    const wechatLoginBtnName = btnNameMap[storageLangTag] || 'Continue with WeChat';

    this.setData({
      codeLogin: Boolean((await fresnsConfig('send_email_service')) || (await fresnsConfig('send_sms_service'))),
      switchLogin: Boolean(emailLogin && phoneLogin),
      type: loginType,
      fresnsLang: await fresnsLang(),
      wechatLoginBtnName: wechatLoginBtnName,
      countryCodeRange,
      countryCodeIndex: countryCodeRange.indexOf(defaultCode),
    });
  },

  // 交互操作
  onLoginTypeChange: function (e) {
    this.setData({
      loginType: e.detail.value,
    });
  },
  onTypeChange: function (e) {
    this.setData({
      type: e.detail.value,
      password: '',
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
  onPasswordChange: function (e) {
    const value = e.detail.value;
    this.setData({
      password: value,
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

  // 微信登录
  onWeChatLogin: async function () {
    this.setData({
      btnLoading: true,
    });

    await fresnsLogin.wechatLogin();
  },

  // 发送验证码
  sendVerifyCode: async function (e) {
    const { type, emailAddress, countryCodeRange, countryCodeIndex, phoneNumber } = this.data;

    let params = null;
    if (type === Type.Email) {
      params = {
        type: 'email',
        useType: 2, // 2.已存账号验证
        templateId: 7, // 7.使用验证码登录
        account: emailAddress,
        countryCode: null,
      };
    } else {
      params = {
        type: 'sms',
        useType: 2, // 2.已存账号验证
        templateId: 7, // 7.使用验证码登录
        account: phoneNumber,
        countryCode: countryCodeRange[countryCodeIndex],
      };
    }

    this.fresnsSend(params.type, params.useType, params.templateId, params.account, params.countryCode);
  },

  // 提交登录
  onSubmit: async function () {
    wx.showNavigationBarLoading();

    const { loginType, type, emailAddress, countryCodeRange, countryCodeIndex, phoneNumber, password, verifyCode } =
      this.data;
    let params = null;

    if (loginType === LoginType.Password) {
      if (type === Type.Email) {
        params = {
          type: 'email',
          account: emailAddress,
          password: base64_encode(password),
        };
      }
      if (type === Type.Phone) {
        params = {
          type: 'phone',
          account: phoneNumber,
          countryCode: +countryCodeRange[countryCodeIndex],
          password: base64_encode(password),
        };
      }
    }
    if (loginType === LoginType.VerifyCode) {
      if (type === Type.Email) {
        params = {
          type: 'email',
          account: emailAddress,
          verifyCode: verifyCode,
        };
      }
      if (type === Type.Phone) {
        params = {
          type: 'phone',
          account: phoneNumber,
          countryCode: +countryCodeRange[countryCodeIndex],
          verifyCode: verifyCode,
        };
      }
    }

    await fresnsLogin.loginAccount(params);

    wx.hideNavigationBarLoading();
  },
});
