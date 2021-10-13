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
  onClickMemberLike: async function (e) {
    const member = e?.currentTarget?.dataset?.member || e

    // 当前未喜欢，点击喜欢
    if (member.likeStatus === 0) {
      const res = await this.actionLike(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].likeStatus`]: 1,
          [`members[${idx}].stats.likeMeCount`]: this.data.members[idx].stats.likeMeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (member.likeStatus === 1) {
      const res = await this.actionUnLike(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].likeStatus`]: 0,
          [`members[${idx}].stats.likeMeCount`]: this.data.members[idx].stats.likeMeCount - 1,
        })
      }
      return
    }
  },
  onClickMemberFollow: async function (e) {
    const member = e?.currentTarget?.dataset?.member || e

    // 当前未关注，点击关注
    if (member.followStatus === 0) {
      const res = await this.actionFollow(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].followStatus`]: 1,
          [`members[${idx}].stats.followMeCount`]: this.data.members[idx].stats.followMeCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (member.followStatus === 1) {
      const res = await this.actionUnFollow(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].followStatus`]: 0,
          [`members[${idx}].stats.followMeCount`]: this.data.members[idx].stats.followMeCount - 1,
        })
      }
      return
    }
  },
  onClickMemberBlock: async function (e) {
    const member = e?.currentTarget?.dataset?.member || e

    // 当前未关注，点击关注
    if (member.shieldStatus === 0) {
      const res = await this.actionBlock(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].shieldStatus`]: 1,
          [`members[${idx}].stats.shieldMeCount`]: this.data.members[idx].stats.shieldMeCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (member.shieldStatus === 1) {
      const res = await this.actionUnBlock(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].shieldStatus`]: 0,
          [`members[${idx}].stats.shieldMeCount`]: this.data.members[idx].stats.shieldMeCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 1,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 1,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 1,
      markId: id,
    })
  },
}
