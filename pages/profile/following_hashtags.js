/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged')
  ],
  /** 页面数据 **/
  data: {
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