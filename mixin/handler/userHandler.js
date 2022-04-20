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
  onClickUserLike: async function (e) {
    const usersKey = 'users';
    const user = e.currentTarget.dataset.user;
    // 当前未喜欢，点击喜欢
    if (user.likeStatus === 0) {
      const res = await this.actionLike(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].likeStatus`]: 1,
          [`${usersKey}[${idx}].stats.likeMeCount`]: this.data.users[idx].stats.likeMeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (user.likeStatus === 1) {
      const res = await this.actionUnLike(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].likeStatus`]: 0,
          [`${usersKey}[${idx}].stats.likeMeCount`]: this.data.users[idx].stats.likeMeCount - 1,
        })
      }
      return
    }
  },
  onClickUserFollow: async function (e) {
    const usersKey = 'users';
    const user = e.currentTarget.dataset.user;
    // 当前未关注，点击关注
    if (user.followStatus === 0) {
      const res = await this.actionFollow(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].followStatus`]: 1,
          [`${usersKey}[${idx}].stats.followMeCount`]: this.data.users[idx].stats.followMeCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (user.followStatus === 1) {
      const res = await this.actionUnFollow(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].followStatus`]: 0,
          [`${usersKey}[${idx}].stats.followMeCount`]: this.data.users[idx].stats.followMeCount - 1,
        })
      }
      return
    }
  },
  onClickUserBlock: async function (e) {
    const usersKey = 'users';
    const user = e.currentTarget.dataset.user;
    // 当前未关注，点击关注
    if (user.blockStatus === 0) {
      const res = await this.actionBlock(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].blockStatus`]: 1,
          [`${usersKey}[${idx}].stats.blockMeCount`]: this.data.users[idx].stats.blockMeCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (user.blockStatus === 1) {
      const res = await this.actionUnBlock(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`${usersKey}[${idx}].blockStatus`]: 0,
          [`${usersKey}[${idx}].stats.blockMeCount`]: this.data.users[idx].stats.blockMeCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 1,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 1,
      markTarget: 1,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 2,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 2,
      markTarget: 1,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.user.userMark({
      type: 1,
      markType: 3,
      markTarget: 1,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.user.userMark({
      type: 2,
      markType: 3,
      markTarget: 1,
      markId: id,
    })
  },
}
