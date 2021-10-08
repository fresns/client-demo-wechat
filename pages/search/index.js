/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  /** 页面数据 **/
  data: {
    tabs: [{ title: '成员' }, { title: '小组' }, { title: '话题' }, { title: '帖子' }, { title: '评论' }],
    inputFocus: true,
    inputVal: '',
    activeTab: 0,
  },
  onTabChange (e) {
    const index = e.detail.index
    this.setData({
      activeTab: index,
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: '',
    })
  },
  showInput: function () {
    this.setData({
      inputFocus: true,
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: '',
      inputFocus: false,
    })
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
    })
  },
})