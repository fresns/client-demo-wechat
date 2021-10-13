/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged')
  ],
  data: {
    tabs: [
      { title: '服务条款' },
      { title: '隐私权政策' },
      { title: 'Cookie 政策' }
    ],
    terms: null,
    privacy: null,
    cookie: null,
  },
  onLoad: async function (options) {
    const value1 = await getConfigItemValue('account_terms')
    const value2 = await getConfigItemValue('account_privacy')
    const value3 = await getConfigItemValue('account_cookie')
    this.setData({
      terms: value1,
      privacy: value2,
      cookie: value3,
    })
  },
});