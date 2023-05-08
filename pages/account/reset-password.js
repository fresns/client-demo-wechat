/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';
import { base64_encode } from '../../libs/base64/base64';

const Type = {
  Mobile: '0',
  Email: '1',
};

Page({
  /** 外部 mixin 引入 **/
  mixins: [require('../../mixins/themeChanged')],

  /** 页面的初始数据 **/
  data: {
    fresnsLang: null,

    type: Type.Mobile,

    // 邮箱地址
    emailAddress: '',

    // 手机相关信息
    mobileAreaRange: [],
    mobileAreaIndex: null,
    mobileNumber: '',

    // 验证码
    verifyCode: '',
    // 验证码等待中
    isVerifyCodeWaiting: false,
    waitingRemainSeconds: 60,

    // 密码
    password: '',
    // 二次确认密码
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
    const mobileAreaRange = codeArray.length === 1 ? [defaultCode] : codeArray;

    this.setData({
      fresnsLang: await fresnsConfig('language_pack_contents'),
      mobileAreaRange,
      mobileAreaIndex: mobileAreaRange.indexOf(defaultCode),
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
  onMobileAreaPickerChange: function (e) {
    const idxStr = e.detail.value;
    this.setData({
      mobileAreaIndex: +idxStr,
    });
  },
  onMobileNumberChange: function (e) {
    const value = e.detail.value;
    this.setData({
      mobileNumber: value,
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
    const {
      type,
      emailAddress,
      mobileAreaRange,
      mobileAreaIndex,
      mobileNumber,
      isVerifyCodeWaiting,
      waitingRemainSeconds,
    } = this.data;
    if (isVerifyCodeWaiting) {
      wx.showToast({
        title: `发送冷却中 ${waitingRemainSeconds}s`,
        icon: 'none',
      });
      return;
    }
    let params = null;
    if (type === Type.Email) {
      if (!emailAddress) {
        wx.showToast({
          title: (await fresnsLang('email')) + ': ' + (await fresnsLang('errorEmpty')),
          icon: 'none',
        });
        return;
      }

      params = {
        type: 'email',
        useType: 2,
        templateId: 5,
        account: emailAddress,
      };
    }
    if (type === Type.Mobile) {
      if (!mobileNumber) {
        wx.showToast({
          title: (await fresnsLang('phone')) + ': ' + (await fresnsLang('errorEmpty')),
          icon: 'none',
        });
        return;
      }

      params = {
        type: 'sms',
        useType: 2,
        templateId: 5,
        account: mobileNumber,
        countryCode: mobileAreaRange[mobileAreaIndex],
      };
    }

    const sendVerifyRes = await fresnsApi.common.commonSendVerifyCode(params);
    if (sendVerifyRes.code === 0) {
      this.setData({ isVerifyCodeWaiting: true, waitingRemainSeconds: 60 });

      const interval = setInterval(() => {
        const now = this.data.waitingRemainSeconds - 1;
        this.setData({
          waitingRemainSeconds: now,
          isVerifyCodeWaiting: now > 0,
        });
        if (now <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      wx.showToast({
        title: '验证码发送成功',
        icon: 'none',
      });
    }
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
      type,
      emailAddress,
      mobileAreaRange,
      mobileAreaIndex,
      mobileNumber,
      verifyCode,
      password,
      confirmPassword,
    } = this.data;
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码填写不一致',
      });
      return;
    }

    let params = null;
    if (type === Type.Mobile) {
      params = {
        type: 'phone',
        account: mobileNumber,
        countryCode: mobileAreaRange[mobileAreaIndex],
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

    const registerRes = await fresnsApi.account.accountResetPassword(params);
    if (registerRes.code === 0) {
      wx.showToast({
        title: '密码重置成功',
      });
      wx.redirectTo({
        url: '/pages/account/login',
      });
    }
  },
});
