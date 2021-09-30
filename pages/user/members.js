/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import { globalInfo } from '../../handler/globalInfo'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    members: [],
    // 密码输入框是否可见
    isPasswordDialogVisible: false,
    // 输入的密码
    password: '',
  },
  onShow: async function () {
    const members = globalInfo.loginUser?.members
    this.setData({
      members: members,
    })
  },
  /**
   * 选择用户
   * @param e
   * @return {Promise<void>}
   */
  selectUserMember: async function (e) {
    const { member } = e.currentTarget.dataset
    if (member.password) {
      this.setData({
        isPasswordDialogVisible: true,
      })
    } else {
      await globalInfo.selectMember(member)
      wx.navigateBack()
    }
  },
  /**
   * 密码修改监听函数
   * @param e
   * @return {*}
   */
  onInputPassword: function (e) {
    const { value } = e.detail
    this.setData({
      password: value,
    })
    return value
  },
  /**
   * 提交密码
   * @param e
   * @return {Promise<void>}
   */
  onSubmitPassword: async function (e) {
    const { member } = e.currentTarget.dataset
    try {
      await globalInfo.selectMember(member, this.data.password)
    } catch (e) {
      console.error(e.message)
    } finally {
      this.setData({
        isPasswordDialogVisible: false,
        password: '',
      })
      wx.navigateBack()
    }
  },
})
