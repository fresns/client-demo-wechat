/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../util/callPageFunction'
import { getCurPage } from '../../util/getCurPage'

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    fsui: String,
    post: Object,
  },
  data: {},
  lifetimes: {},
  methods: {
    onClickPostLike: async function () {
      callPageFunction('onClickPostLike', this.data.post)
    },
    onClickComment: async function () {
      const { post } = this.data
      const curRoute = '/' + getCurPage().route
      if (curRoute !== '/pages/posts/detail') {
        wx.navigateTo({
          url: `/pages/posts/detail?pid=${post.pid}`,
        })
      }
    },
    onClickShare: async function () {
      callPageFunction('onClickShare', this.data.post)
    },
    onClickCreateComment: async function () {
      const { post } = this.data
      wx.navigateTo({
        url: `/pages/editor/index?type=comment&mode=create&pid=${post.pid}`,
      })
    },
    onClickModifyPost: async function (e) {
      const { post } = this.data
      wx.navigateTo({
        url: `/pages/editor/index?type=post&mode=modify&uuid=${post.pid}`,
      })
    },
  },
})
