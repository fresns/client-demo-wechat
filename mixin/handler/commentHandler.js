/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.成员 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
  onClickCommentLike: async function (e) {
    const comment = e?.currentTarget?.target?.comment || e

    // 当前未喜欢，点击喜欢
    if (comment.likeStatus === 0) {
      const res = await this.actionLike(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].likeStatus`]: 1,
          [`comments[${idx}].likeCount`]: this.data.comments[idx].likeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (comment.likeStatus === 1) {
      const res = await this.actionUnLike(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].likeStatus`]: 0,
          [`comments[${idx}].likeCount`]: this.data.comments[idx].likeCount - 1,
        })
      }
      return
    }
  },
  onClickCommentFollow: async function (e) {
    const comment = e?.currentTarget?.target?.comment || e

    // 当前未关注，点击关注
    if (comment.followStatus === 0) {
      const res = await this.actionFollow(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].followStatus`]: 1,
          [`comments[${idx}].followCount`]: this.data.comments[idx].followCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (comment.followStatus === 1) {
      const res = await this.actionUnFollow(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].followStatus`]: 0,
          [`comments[${idx}].followCount`]: this.data.comments[idx].followCount - 1,
        })
      }
      return
    }
  },
  onClickCommentBlock: async function (e) {
    const comment = e?.currentTarget?.target?.comment || e

    // 当前未关注，点击关注
    if (comment.shieldStatus === 0) {
      const res = await this.actionBlock(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].shieldStatus`]: 1,
          [`comments[${idx}].shieldCount`]: this.data.comments[idx].shieldCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (comment.shieldStatus === 1) {
      const res = await this.actionUnBlock(comment.cid)
      if (res.code === 0) {
        const idx = this.data.comments.findIndex(value => value.cid === comment.cid)
        this.setData({
          [`comments[${idx}].shieldStatus`]: 0,
          [`comments[${idx}].shieldCount`]: this.data.comments[idx].shieldCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 5,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 5,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 5,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 5,
      markId: id,
    })
  },
}
