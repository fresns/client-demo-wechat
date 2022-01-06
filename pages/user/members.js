/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import member from '../../api/detail/member'
import { globalInfo } from '../../configs/fresnsGlobalInfo'

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
    currentMember: '',
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
        currentMember: member
      })
    } else {
      await globalInfo.selectMember(member)
      wx.redirectTo({
        url: '/pages/user/index',
      })
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
    const { currentMember } = this.data
    try {
      const selectMemberRes = await globalInfo.selectMember(currentMember, this.data.password)
      const { message, code } = selectMemberRes
      if (code === 0) {
        this.setData({
          isPasswordDialogVisible: false,
          password: '',
        })
        wx.redirectTo({
          url: '/pages/user/index',
        })
      }
      if (code !== 0) {
        wx.showToast({
          title: message,
          icon: 'none',
        })
      }
    } catch (e) {
      console.error(e.message)
    }
  },
})
