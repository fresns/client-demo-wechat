/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { base64_encode } from '../../libs/base64/base64'
import { globalInfo } from '../../handler/globalInfo'

const Type = {
  Email: '0',
  Mobile: '1',
}

const VerifyType = {

}

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    type: Type.Email,

    // 邮箱地址
    emailAddress: '',

    // 手机相关信息
    mobileAreaRange: ['+86', '+1', '+886'],
    mobileAreaIndex: 0,
    mobileNumber: '',

    // 密码
    password: '',
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
  onSubmit: async function () {
    const { type, emailAddress, mobileAreaRange, mobileAreaIndex, mobileNumber, password } = this.data
    let params = null
    if (type === Type.Email) {
      params = {
        type: 1,
        account: emailAddress,
        password: base64_encode(password),
      }
    }
    if (type === Type.Mobile) {
      params = {
        type: 2,
        account: mobileNumber,
        countryCode: mobileAreaRange[mobileAreaIndex],
        password: base64_encode(password),
      }
    }

    const isLogin = await globalInfo.login(params)
    if (isLogin) {
      const pages = getCurrentPages()
      pages[pages.length - 2].onLoad();
      wx.navigateBack()
    } else {
      wx.showToast({
        title: '登录失败，请稍后重试',
        icon: 'none',
      })
    }
  },
})
