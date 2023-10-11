/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../fresns';
import { fresnsConfig, fresnsCodeMessage, fresnsLang } from '../../api/tool/function';
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
  mixins: [
    require('../../mixins/globalConfig'),
    require('../../mixins/sendVerifyCode'),
    require('../../mixins/fresnsExtensions'),
  ],

  /** 页面的初始数据 **/
  data: {
    showPrivacy: false,
    fresnsLang: null,
    wechatLoginBtnName: null,

    codeLogin: false,
    switchLogin: false,

    deactivateWeChatLogin: false,
    hasWechatInstall: true,
    loginTabType: LoginType.WeChat,
    accountType: Type.Phone,

    btnLoading: false,

    // 多端配置
    appInfo: {},
    appleLoginBtnName: null,
    appleBtnLoading: false,

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
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_login'),
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
    const countryCodeRange = codeArray.length == 1 ? [defaultCode] : codeArray;

    const emailLogin = Boolean(await fresnsConfig('site_email_login'));
    const phoneLogin = Boolean(await fresnsConfig('site_phone_login'));

    let loginType = Type.Phone;
    if (!emailLogin || !phoneLogin) {
      loginType = phoneLogin ? Type.Phone : Type.Email;
    }

    const storageLangTag = wx.getStorageSync('langTag');
    const btnNameMap = {
      en: 'Sign in with WeChat',
      'zh-Hans': '通过微信登录',
      'zh-Hant': '透過 WeChat 登入',
    };
    const wechatLoginBtnName = btnNameMap[storageLangTag] || 'Sign in with WeChat';

    const appleBtnNameMap = {
      en: 'Sign in with Apple',
      'zh-Hans': '通过 Apple 登录',
      'zh-Hant': '透過 Apple 登入',
    };
    const appleLoginBtnName = appleBtnNameMap[storageLangTag] || 'Sign in with Apple';

    this.setData({
      deactivateWeChatLogin: appConfig?.deactivateWeChatLogin,
      loginTabType: appConfig?.deactivateWeChatLogin ? LoginType.Password : LoginType.WeChat,
      codeLogin: Boolean((await fresnsConfig('send_email_service')) || (await fresnsConfig('send_sms_service'))),
      switchLogin: Boolean(emailLogin && phoneLogin),
      accountType: loginType,
      fresnsLang: await fresnsLang(),
      wechatLoginBtnName: wechatLoginBtnName,
      countryCodeRange,
      countryCodeIndex: countryCodeRange.indexOf(defaultCode),
      appInfo: wx.getStorageSync('appInfo'),
      appleLoginBtnName: appleLoginBtnName,
    });

    const appInfo = wx.getStorageSync('appInfo');
    if (appInfo.isApp && appInfo.platform == 'ios') {
      wx.miniapp.hasWechatInstall({
        success: (res) => {
          this.setData({
            hasWechatInstall: res.hasWechatInstall,
          });
        },
      });
    }

    if (options.showToast == 'true') {
      wx.showToast({
        title: (await fresnsCodeMessage('31501')) || '请先登录账号再操作',
        icon: 'none',
      });
    }
  },

  // 交互操作
  onLoginTabChange: function (e) {
    this.setData({
      loginTabType: e.detail.value,
    });
  },
  onAccountTypeChange: function (e) {
    this.setData({
      accountType: e.detail.value,
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

    await fresnsLogin.wechatLogin(false, () => {
      this.setData({
        btnLoading: false,
      });
    });
  },

  // App 微信登录
  onAppWeChatLogin: async function () {
    this.setData({
      btnLoading: true,
    });

    await fresnsLogin.appWechatLogin(false, () => {
      this.setData({
        btnLoading: false,
      });
    });
  },

  // 苹果账号登录
  onAppleLogin: async function () {
    this.setData({
      appleBtnLoading: true,
    });

    await fresnsLogin.appleLogin(false, () => {
      this.setData({
        btnLoading: false,
      });
    });
  },

  // 发送验证码
  sendVerifyCode: async function (e) {
    const { accountType, emailAddress, countryCodeRange, countryCodeIndex, phoneNumber } = this.data;

    let params = null;
    if (accountType == Type.Email) {
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

    const {
      loginTabType,
      accountType,
      emailAddress,
      countryCodeRange,
      countryCodeIndex,
      phoneNumber,
      password,
      verifyCode,
    } = this.data;
    let params = null;

    if (loginTabType == LoginType.Password) {
      if (accountType == Type.Email) {
        params = {
          type: 'email',
          account: emailAddress,
          password: base64_encode(password),
        };
      }
      if (accountType == Type.Phone) {
        params = {
          type: 'phone',
          account: phoneNumber,
          countryCode: +countryCodeRange[countryCodeIndex],
          password: base64_encode(password),
        };
      }
    }
    if (loginTabType == LoginType.VerifyCode) {
      if (accountType == Type.Email) {
        params = {
          type: 'email',
          account: emailAddress,
          verifyCode: verifyCode,
        };
      }
      if (accountType == Type.Phone) {
        params = {
          type: 'phone',
          account: phoneNumber,
          countryCode: +countryCodeRange[countryCodeIndex],
          verifyCode: verifyCode,
        };
      }
    }

    console.log('loginAccount', params);
    await fresnsLogin.loginAccount(params);

    wx.hideNavigationBarLoading();
  },
});
