/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

module.exports = {
  data: {
    curUser: null,
  },
  onLoad: async function (options) {
    const { uid } = options
    const userDetailRes = await Api.user.userDetail({
      viewUid: uid,
    })
    if (userDetailRes.code === 0) {
      this.setData({
        curUser: userDetailRes.data.detail,
      })
    }
  }
}
