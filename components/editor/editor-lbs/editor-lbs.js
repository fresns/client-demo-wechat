/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction'

Component({
  properties: {
    location: Object,
  },
  data: {
    poi: null,
    showIOSDialog: false
  },
  close: function() {
      this.setData({
          showIOSDialog: false
      });
  },
  openIOS: function () {
      this.setData({
          showIOSDialog: true
      });
  },
  methods: {
    handleClickAddLocation: async function () {
      callPageFunction('onSelectLocation')
    },
  },
  observers: {
    'location': function (params) {
      this.setData({
        poi: params?.poi,
      })
    },
  },
})
