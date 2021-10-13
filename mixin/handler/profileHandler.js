/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

module.exports = {
  data: {
    curMember: null,
  },
  onLoad: async function (options) {
    const { mid } = options
    const memberDetailRes = await Api.member.memberDetail({
      viewMid: mid,
    })
    if (memberDetailRes.code === 0) {
      this.setData({
        curMember: memberDetailRes.data.detail,
      })
    }
  }
}
