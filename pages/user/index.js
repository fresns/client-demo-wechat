/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'
import { globalInfo } from '../../configs/fresnsGlobalInfo'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor'),
  ],
  data: {
    user: null,
    loginMember: null,
    loginMemberCommon: null,
    languageDialog: false,
  },
  onLoad: async function (options) {
    await this.loadUserInfo()
  },
  loadUserInfo: async function () {
    await globalInfo.awaitLogin()
    const [userDetailRes, memberDetailRes] = await Promise.all([
      Api.user.userDetail(),
      Api.member.memberDetail({
        viewMid: globalInfo.mid,
      }),
    ])
    if (userDetailRes.code === 0 && memberDetailRes.code === 0) {
      this.setData({
        user: userDetailRes.data,
        loginMember: memberDetailRes.data.detail,
        loginMemberCommon: memberDetailRes.data.common
      })
    }
  },
  showLanguageDialog: function () {
    this.setData({
      languageDialog: true,
    })
  },
  hideLanguageDialog: function () {
    this.setData({
      languageDialog: false,
    })
  },
  selectLanguage: async function () {

  },
  onClickLogout: async function () {
    await globalInfo.logout()
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: async function () {
    await this.loadUserInfo()
    wx.stopPullDownRefresh()
  },
})
