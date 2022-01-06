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
  onClickPostLike: async function (post, postsKey = 'posts') {
    // 当前未喜欢，点击喜欢
    if (post.likeStatus === 0) {
      const res = await this.actionLike(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].likeStatus`]: 1,
          [`${postsKey}[${idx}].likeCount`]: this.data.posts[idx].likeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (post.likeStatus === 1) {
      const res = await this.actionUnLike(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].likeStatus`]: 0,
          [`${postsKey}[${idx}].likeCount`]: this.data.posts[idx].likeCount - 1,
        })
      }
      return
    }
  },
  onClickPostFollow: async function (post, postsKey = 'posts') {
    // 当前未关注，点击关注
    if (post.followStatus === 0) {
      const res = await this.actionFollow(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].followStatus`]: 1,
          [`${postsKey}[${idx}].followCount`]: this.data.posts[idx].followCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (post.followStatus === 1) {
      const res = await this.actionUnFollow(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].followStatus`]: 0,
          [`${postsKey}[${idx}].followCount`]: this.data.posts[idx].followCount - 1,
        })
      }
      return
    }
  },
  onClickPostBlock: async function (post, postsKey = 'posts') {
    // 当前未关注，点击关注
    if (post.shieldStatus === 0) {
      const res = await this.actionBlock(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].shieldStatus`]: 1,
          [`${postsKey}[${idx}].shieldCount`]: this.data.posts[idx].shieldCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (post.shieldStatus === 1) {
      const res = await this.actionUnBlock(post.pid)
      if (res.code === 0) {
        const idx = this.data.posts.findIndex(value => value.pid === post.pid)
        this.setData({
          [`${postsKey}[${idx}].shieldStatus`]: 0,
          [`${postsKey}[${idx}].shieldCount`]: this.data.posts[idx].shieldCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 4,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 4,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 4,
      markId: id,
    })
  },
}
