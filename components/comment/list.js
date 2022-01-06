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
  /**
   * 组件的属性列表
   */
  properties: {
    fsui: String,
    comment: Object,
  },
  /**
   * 组件的初始数据
   */
  data: {
    imageFiles: [],
    videoFiles: [],
    audioFiles: [],
    docFiles: [],
    iconsObj: {},
    showMoreMenu: false,
    marks: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClickCommentLike: async function (e) {
      callPageFunction('onClickCommentLike', this.data.comment)
    },
    onClickComment: async function () {
      const { comment } = this.data
      const curRoute = '/' + getCurPage().route
      if (curRoute !== '/pages/comments/detail') {
        wx.navigateTo({
          url: `/pages/comments/detail?cid=${comment.cid}`,
        })
      }
    },
    onClickShare: async function () {
      callPageFunction('onClickShare', this.data.comment)
    },
    onClickCreateComment: async function () { },

    _onClickModifyComment: function (comment) {
      wx.navigateTo({
        url: `/pages/editor/index?type=comment&mode=modify&uuid=${comment.cid}&post_id=${comment.pid}`,
      })
    },
    _onClickCommentFollow: function (comment) {
      callPageFunction('onClickCommentFollow', comment)
    },
    _onClickCommentBlock: function (comment) {
      callPageFunction('onClickCommentBlock', comment)
    },
    _onclickMemberDelete: function (comment) {
      Api.member.memberDelete({
        type: 2,
        uuid: comment.cid
      }).then(function (memberDeleteRes) {
        if (memberDeleteRes.code === 0) {
          callPageFunction('onLoad')
        }
      })
    },
    onClickMoreMenu: async function (e) {
      const comment = this.data.comment;
      const showMoreMenu = true;
      let marks = [];
      if (comment.editStatus.isMe && comment.editStatus.canEdit) {
        marks.push({ text: "编辑", value: "_onClickModifyComment" })
      }
      if (comment.editStatus.isMe && comment.editStatus.canDelete) {
        marks.push({ text: "删除", value: "_onclickMemberDelete" })
      }
      if (comment.followSetting) {
        marks.push({ text: comment.followStatus ? "已" + comment.followName : comment.followName, value: "_onClickCommentFollow" })
      }
      if (comment.shieldSetting) {
        marks.push({ text: comment.shieldStatus ? "已" + comment.shieldName : comment.shieldName, value: "_onClickCommentBlock" })
      }
      this.setData({
        showMoreMenu,
        marks,
      })
    },
    onClickMark: async function (e) {
      const value = e.detail.value
      this[value](this.data.comment);
      this.setData({
        showMoreMenu: false
      })
    }
  },
  observers: {
    'comment': function (comment) {
      if (!comment) {
        return
      }

      this.setData({
        imageFiles: comment.files?.filter(file => file.type === 1) || [],
        videoFiles: comment.files?.filter(file => file.type === 2) || [],
        audioFiles: comment.files?.filter(file => file.type === 3) || [],
        docFiles: comment.files?.filter(file => file.type === 4) || [],
        iconsObj: comment.icons?.reduce((obj, icon) => {
          obj[icon.name] = icon
          return obj
        }, {}) || {},
      })
    },
  },
})
