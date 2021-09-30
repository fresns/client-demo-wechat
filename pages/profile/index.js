/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/imageGallery'),
  ],
  data: {
    user: null,
    member: null,
  },
  onLoad: async function (options) {
    const { mid } = options
    await Promise.all([
      this._fetchUserDetail(mid),
      this._fetchMemberDetail(mid),
    ])
  },
  _fetchUserDetail: async function (mid) {
    // TODO FIXME
    const userDetailRes = await Api.user.userDetail({
      mid: mid,
    })
    if (userDetailRes.code === 0) {
      this.setData({ userDetail: userDetailRes.data })
    }
  },
  _fetchMemberDetail: async function (mid) {
    const memberDetailRes = await Api.member.memberDetail({
      viewMid: mid,
    })
    if (memberDetailRes.code === 0) {
      this.setData({ member: memberDetailRes.data.detail })
    }
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
