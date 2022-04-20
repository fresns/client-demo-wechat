/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'
import { userDelete } from '../../api/detail/user'
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
  data: {
    imageFiles: [],
    videoFiles: [],
    audioFiles: [],
    docFiles: [],
    iconsObj: {},
    showContentMoreActionsheet: false,
    marks: [],
  },
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
    _onClickModifyPost: function (post) {
      wx.navigateTo({
        url: `/pages/editor/index?type=post&mode=modify&pid=${post.pid}`,
      })
    },
    _onClickPostFollow: function (post) {
      callPageFunction('onClickPostFollow', post)
    },
    _onClickPostBlock: function (post) {
      callPageFunction('onClickPostBlock', post)
    },
    _onclickUserDelete: function (post) {
      Api.user.userDelete({
        type: 1,
        fsid: post.pid
      }).then(function (userDeleteRes) {
        console.log(userDeleteRes);
        if (userDeleteRes.code === 0) {
          callPageFunction('onLoad')
        }
      })
    },

    onClickContentMore: async function (e) {
      const post = this.data.post;
      const showContentMoreActionsheet = true;
      let marks = [];
      if (post.editStatus.isMe && post.editStatus.canEdit) {
        marks.push({ text: "编辑", value: "_onClickModifyPost" })
      }
      if (post.editStatus.isMe && post.editStatus.canDelete) {
        marks.push({ text: "删除", value: "_onclickUserDelete" })
      }
      if (post.followSetting) {
        marks.push({ text: post.followStatus ? "已" + post.followName : post.followName, value: "_onClickPostFollow" })
      }
      if (post.blockSetting) {
        marks.push({ text: post.blockStatus ? "已" + post.blockName : post.blockName, value: "_onClickPostBlock" })
      }
      this.setData({
        showContentMoreActionsheet,
        marks,
      })
    },
    onClickMark: async function (e) {
      const value = e.detail.value
      this[value](this.data.post);
      this.setData({
        showContentMoreActionsheet: false
      })
    }
  },
  observers: {
    'post': function (post) {
      if (!post) {
        return
      }

      this.setData({
        imageFiles: post.files?.filter(file => file.type === 1) || [],
        videoFiles: post.files?.filter(file => file.type === 2) || [],
        audioFiles: post.files?.filter(file => file.type === 3) || [],
        docFiles: post.files?.filter(file => file.type === 4) || [],
        iconsObj: post.icons?.reduce((obj, icon) => {
          obj[icon.name] = icon
          return obj
        }, {}) || {},
      })
    },
  },
})
