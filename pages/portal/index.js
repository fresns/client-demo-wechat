/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    content: null,
  },
  onLoad: async function (options) {
    const value = await getConfigItemValue('portal_8')
    this.setData({
      // FIXME
      content: value.replaceAll('view', 'div'),
    })
  },
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: function () {
    return {
      title: 'Fresns',
    }
  },
  /** 右上角菜单-分享到朋友圈 **/
  onShareTimeline: function () {
    return {
      title: 'Fresns',
    }
  },
})
