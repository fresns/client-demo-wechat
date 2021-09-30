/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    // 验证码类型
    codeType: null,
    // 验证码
    verifyCode: null,
  },
  chooseImage: async function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFiles = res.tempFiles
        console.log(tempFiles)
      },
    })
  },
  modifyNickname: async function (e) {
    const value = e.detail.value
  },
  modifyMName: async function (e) {
    const value = e.detail.value
  },
  modifyBio: async function (e) {
    const value = e.detail.value
  },
  modifyGender: async function (e) {

  },
  modifyBirthday: async function (e) {

  },
  /**
   * 修改用户信息
   * @return {Promise<void>}
   * @private
   */
  _modifyUserInfo: async function () {

  },
  /**
   * 修改成员信息
   * @return {Promise<void>}
   * @private
   */
  _modifyMemberInfo: async function () {

  },
})