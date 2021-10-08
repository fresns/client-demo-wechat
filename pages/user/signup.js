/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

const Type = {
  Mobile: '0',
  Email: '1',
}

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    type: Type.Mobile,

    // 邮箱地址
    emailAddress: '',

    // 手机相关信息
    mobileAreaRange: ['+86', '+1', '+886'],
    mobileAreaIndex: 0,
    mobileNumber: '',

    // 验证码
    verifyCode: '',

    // 密码
    password: '',
    // 二次确认密码
    confirmPassword: '',

    // 昵称
    nickname: '',
  },
  onTypeChange: function (e) {
    this.setData({
      type: e.detail.value,
      password: '',
      confirmPassword: '',
      verifyCode: '',
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
  onVerifyCodeChange: function (e) {
    const value = e.detail.value
    this.setData({
      verifyCode: value,
    })
    return value
  },
  sendVerifyCode: async function (e) {
    const { type, emailAddress, mobileAreaRange, mobileAreaIndex, mobileNumber } = this.data
    let params = null
    if (type === Type.Email) {
      params = {
        type: 1,
        useType: 1,
        templateId: 2,
        account: emailAddress,
      }
    }
    if (type === Type.Mobile) {
      params = {
        type: 2,
        useType: 1,
        templateId: 2,
        account: mobileNumber,
        countryCode: +mobileAreaRange[mobileAreaIndex],
      }
    }

    const sendVerifyRes = await Api.info.infoSendVerifyCode(params)
    if (sendVerifyRes.code === 0) {
      wx.showToast({
        title: '验证码发送成功',
        icon: 'none',
      })
    }
  },
  onPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      password: value,
    })
    return value
  },
  onConfirmPasswordChange: function (e) {
    const value = e.detail.value
    this.setData({
      confirmPassword: value,
    })
    return value
  },
  onNicknameChange: function (e) {
    const value = e.detail.value
    this.setData({
      nickname: value,
    })
    return value
  },
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
      nickname,
    } = this.data
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码填写不一致',
      })
      return
    }

    let params = null
    if (type === Type.Mobile) {
      params = {
        type: 2,
        account: mobileNumber,
        countryCode: +mobileAreaRange[mobileAreaIndex],
        verifyCode: verifyCode,
        password: password,
        nickname: nickname,
      }
    }
    if (type === Type.Email) {
      params = {
        type: 1,
        account: emailAddress,
        verifyCode: verifyCode,
        password: password,
        nickname: nickname,
      }
    }

    const registerRes = await Api.user.userRegister(params)
    if (registerRes.code === 0) {
      wx.showToast({
        title: '注册成功',
      })
      wx.redirectTo({
        url: '/pages/user/signin',
      })
    }
  },
})
