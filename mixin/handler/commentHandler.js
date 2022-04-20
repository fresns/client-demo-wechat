/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.用户 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
  onClickCommentLike: async function (comment, options = { dataKey: 'comments', isArray: true }) {
    const { dataKey, isArray } = options
    const prefix = isArray ? `${dataKey}[${this.data[dataKey].findIndex(value => value.cid === comment.cid)}]` : dataKey

    // 当前未喜欢，点击喜欢
    if (comment.likeStatus === 0) {
      const res = await this.actionLike(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            likeStatus: 1,
            likeCount: comment.likeCount + 1,
          }),
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (comment.likeStatus === 1) {
      const res = await this.actionUnLike(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            likeStatus: 0,
            likeCount: comment.likeCount - 1,
          }),
        })
      }
      return
    }
  },
  onClickCommentFollow: async function (comment, options = { dataKey: 'comments', isArray: true }) {
    const { dataKey, isArray } = options
    const prefix = isArray ? `${dataKey}[${this.data[dataKey].findIndex(value => value.cid === comment.cid)}]` : dataKey

    // 当前未关注，点击关注
    if (comment.followStatus === 0) {
      const res = await this.actionFollow(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            followStatus: 1,
            followCount: comment.followCount + 1,
          }),
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (comment.followStatus === 1) {
      const res = await this.actionUnFollow(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            followStatus: 0,
            followCount: comment.followCount - 1,
          }),
        })
      }
      return
    }
  },
  onClickCommentBlock: async function (comment, options = { dataKey: 'comments', isArray: true }) {
    const { dataKey, isArray } = options
    const prefix = isArray ? `${dataKey}[${this.data[dataKey].findIndex(value => value.cid === comment.cid)}]` : dataKey

    // 当前未关注，点击关注
    if (comment.blockStatus === 0) {
      const res = await this.actionBlock(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            blockStatus: 1,
            blockCount: comment.blockCount + 1,
          }),
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (comment.blockStatus === 1) {
      const res = await this.actionUnBlock(comment.cid)
      if (res.code === 0) {
        this.setData({
          [prefix]: Object.assign(comment, {
            blockStatus: 0,
            blockCount: comment.blockCount - 1,
          }),
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 1,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 1,
      markTarget: 5,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 2,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 2,
      markTarget: 5,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 3,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 3,
      markTarget: 5,
      markId: id,
    })
  },
}
