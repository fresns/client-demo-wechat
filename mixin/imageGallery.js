/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
module.exports = {
  data: {
    imageGallery: false,
  },
  ImageClose: function () {
    this.setData({
      imageGallery: false,
    })
  },
  ImageOpen: function () {
    this.setData({
      imageGallery: true,
    })
  },
}