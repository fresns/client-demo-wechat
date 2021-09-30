/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'
import { globalInfo } from '../../handler/globalInfo'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor')
  ],
  data: {
    user: null,
    loginMember: null,
    languageDialog: false,
  },
  onLoad: async function (options) {
    const resultRes = await Api.user.userDetail()
    if (resultRes.code === 0) {
      this.setData({
        user: resultRes.data,
        loginMember: globalInfo.loginMember,
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
})
