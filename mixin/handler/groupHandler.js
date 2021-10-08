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
  onClickGroupLike: async function (e) {
    const group = e?.currentTarget?.dataset?.group || e

    // 当前未喜欢，点击喜欢
    if (group.likeStatus === 0) {
      const res = await this.actionLike(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].likeStatus`]: 1,
          [`groups[${idx}].likeCount`]: this.data.groups[idx].likeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (group.likeStatus === 1) {
      const res = await this.actionUnLike(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].likeStatus`]: 0,
          [`groups[${idx}].likeCount`]: this.data.groups[idx].likeCount - 1,
        })
      }
      return
    }
  },
  onClickGroupFollow: async function (e) {
    const group = e?.currentTarget?.dataset?.group || e

    // 当前未关注，点击关注
    if (group.followStatus === 0) {
      const res = await this.actionFollow(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].followStatus`]: 1,
          [`groups[${idx}].followCount`]: this.data.groups[idx].followCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (group.followStatus === 1) {
      const res = await this.actionUnFollow(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].followStatus`]: 0,
          [`groups[${idx}].followCount`]: this.data.groups[idx].followCount - 1,
        })
      }
      return
    }
  },
  onClickGroupBlock: async function (e) {
    const group = e?.currentTarget?.dataset?.group || e

    // 当前未关注，点击关注
    if (group.shieldStatus === 0) {
      const res = await this.actionBlock(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].shieldStatus`]: 1,
          [`groups[${idx}].shieldCount`]: this.data.groups[idx].shieldCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (group.shieldStatus === 1) {
      const res = await this.actionUnBlock(group.gid)
      if (res.code === 0) {
        const idx = this.data.groups.findIndex(value => value.gid === group.gid)
        this.setData({
          [`groups[${idx}].shieldStatus`]: 0,
          [`groups[${idx}].shieldCount`]: this.data.groups[idx].shieldCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 2,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 2,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 2,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 2,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 2,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 2,
      markId: id,
    })
  },
}
