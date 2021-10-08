/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
Component({
  properties: {
    // 小组是否必选
    isRequired: Boolean,
  },
  data: {
    currentGroup: null,
    array1: ['不发到任何小组', '小组1', '小组2', '小组3'],
    value1: 0,
  },
  bindGroupChange: function(e) {
      this.setData({
          value1: e.detail.value
      })
  },
  methods: {
    handleChooseGroup: function (e) {
      const { group } = e.target.dataset
      this.setData({
        currentGroup: group,
        isShowChooseModal: false,
      })
    },
  },
})
