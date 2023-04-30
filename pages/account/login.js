/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { fresnsLogin } from '../../utils/fresnsLogin';
import { base64_encode } from '../../libs/base64/base64';

const LoginType = {
  WeChat: '0',
  Password: '1',
  VerifyCode: '2',
}

const Type = {
  Mobile: '0',
  Email: '1',
}

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
  ],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,

    codeLogin: false,
    switchLogin: false,

    loginType: LoginType.WeChat,
    type: Type.Mobile,

    // 邮箱地址
    emailAddress: '',

    // 手机相关信息
    mobileAreaRange: [],
    mobileAreaIndex: null,
    mobileNumber: '',

    // 密码
    password: '',

    // 验证码
    verifyCode: '',

    // 验证码等待中
    isVerifyCodeWaiting: false,
    waitingRemainSeconds: 60,
  },

  /** 监听页面加载 **/
  onLoad: async function () {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_account_login'),
    });

    const [defaultCode, codeArray] = await Promise.all(
      [
        fresnsConfig('send_sms_default_code'),
        fresnsConfig('send_sms_supported_codes'),
      ],
    )
    const mobileAreaRange = codeArray.length === 1 ? [defaultCode] :codeArray;

    const emailLogin = Boolean(await fresnsConfig('site_email_login'));
    const phoneLogin = Boolean(await fresnsConfig('site_phone_login'));

    let loginType = Type.Mobile;
    if (!emailLogin || !phoneLogin) {
      loginType = phoneLogin ? Type.Mobile : Type.Email;
    }

    this.setData({
      codeLogin: Boolean(await fresnsConfig('send_email_service') || await fresnsConfig('send_sms_service')),
      switchLogin: Boolean(emailLogin && phoneLogin),
      type: loginType,
      fresnsLang: await fresnsConfig('language_pack_contents'),
      mobileAreaRange,
      mobileAreaIndex: mobileAreaRange.indexOf(defaultCode),
    })
  },

  onLoginTypeChange: function (e) {
    this.setData({
      loginType: e.detail.value,
    })
  },
  onTypeChange: function (e) {
    this.setData({
      type: e.detail.value,
      password: '',
    })
  },
  onEmailAddressChange: function (e) {
    const value = e.detail.value
    this.setData({
      emailAddress: value,
    })
    return value
  },
  onMobileAreaPickerChange: function (e) {
    const idxStr = e.detail.value
    this.setData({
      mobileAreaIndex: +idxStr,
    })
  },
  onMobileNumberChange: function (e) {
    const value = e.detail.value
    this.setData({
      mobileNumber: value,
    })
    return value
  },
  onPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      password: value,
    })
    return value
  },
  onVerifyCodeChange: function (e) {
    const value = e.detail.value
    this.setData({
      verifyCode: value,
    })
    return value
  },
  sendVerifyCode: async function (e) {
    const { type, emailAddress, mobileAreaRange, mobileAreaIndex, mobileNumber, isVerifyCodeWaiting, waitingRemainSeconds } = this.data

    // 倒计时重新发送
    if (isVerifyCodeWaiting) {
      wx.showToast({
        title: await fresnsLang('errorUnavailable') + `: ${waitingRemainSeconds}s`,
        icon: 'none',
      })
      return
    }

    let params = null
    if (type === Type.Email) {
      if (!emailAddress) {
        wx.showToast({
          title: await fresnsLang('email') + ': ' + await fresnsLang('errorEmpty'),
          icon: 'none',
        })
        return
      }

      params = {
        type: "email",
        useType: 2,
        templateId: 7,
        account: emailAddress,
      }
    }
    if (type === Type.Mobile) {
      if (!mobileNumber) {
        wx.showToast({
          title: await fresnsLang('phone') + ': ' + await fresnsLang('errorEmpty'),
          icon: 'none',
        })
        return
      }

      if (!mobileAreaRange[mobileAreaIndex]) {
        wx.showToast({
          title: await fresnsLang('countryCode') + ': ' + await fresnsLang('errorEmpty'),
          icon: 'none',
        })
        return
      }

      params = {
        type: "sms",
        useType: 2,
        templateId: 7,
        account: mobileNumber,
        countryCode: mobileAreaRange[mobileAreaIndex],
      }
    }

    const sendVerifyRes = await fresnsApi.common.commonSendVerifyCode(params)
    if (sendVerifyRes.code === 0) {
      this.setData({ isVerifyCodeWaiting: true, waitingRemainSeconds: 60 })

      const interval = setInterval(() => {
        const now = this.data.waitingRemainSeconds - 1
        this.setData({
          waitingRemainSeconds: now,
          isVerifyCodeWaiting: now > 0,
        })
        if (now <= 0) {
          clearInterval(interval)
        }
      }, 1000)

      wx.showToast({
        title: await fresnsLang('send') + ': ' + await fresnsLang('success'),
        icon: 'none',
      })
    }
  },

  // 提交登录
  onSubmit: async function () {
    wx.showNavigationBarLoading();

    const { loginType, type, emailAddress, mobileAreaRange, mobileAreaIndex, mobileNumber, password, verifyCode } = this.data
    let params = null

    if (loginType === LoginType.Password) {
      if (type === Type.Email) {
        params = {
          type: "email",
          account: emailAddress,
          password: base64_encode(password),
        }
      }
      if (type === Type.Mobile) {
        params = {
          type: "phone",
          account: mobileNumber,
          countryCode: +mobileAreaRange[mobileAreaIndex],
          password: base64_encode(password),
        }
      }
    }
    if (loginType === LoginType.VerifyCode) {
      if (type === Type.Email) {
        params = {
          type: "email",
          account: emailAddress,
          verifyCode: verifyCode,
        }
      }
      if (type === Type.Mobile) {
        params = {
          type: "phone",
          account: mobileNumber,
          countryCode: +mobileAreaRange[mobileAreaIndex],
          verifyCode: verifyCode,
        }
      }
    }

    const loginAccount = await fresnsLogin.loginAccount(params)

    if (loginAccount.code != 0) {
      wx.hideNavigationBarLoading();
    }
  },
})
