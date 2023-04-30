/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.用户 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
  onClickHashtagLike: async function (e) {
    const hashtagsKey = 'hashtags';
    const hashtag = e.currentTarget.dataset.hashtag;
    // 当前未喜欢，点击喜欢
    if (hashtag.likeStatus === 0) {
      const res = await this.actionLike(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].likeStatus`]: 1,
          [`${hashtagsKey}[${idx}].likeCount`]: this.data.hashtags[idx].likeCount + 1,
        })
      }
      return
    }

    // 当前已喜欢，点击取消喜欢
    if (hashtag.likeStatus === 1) {
      const res = await this.actionUnLike(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].likeStatus`]: 0,
          [`${hashtagsKey}[${idx}].likeCount`]: this.data.hashtags[idx].likeCount - 1,
        })
      }
      return
    }
  },
  onClickHashtagFollow: async function (e) {
    const hashtagsKey = 'hashtags';
    const hashtag = e.currentTarget.dataset.hashtag;
    // 当前未关注，点击关注
    if (hashtag.followStatus === 0) {
      const res = await this.actionFollow(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].followStatus`]: 1,
          [`${hashtagsKey}[${idx}].followCount`]: this.data.hashtags[idx].followCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (hashtag.followStatus === 1) {
      const res = await this.actionUnFollow(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].followStatus`]: 0,
          [`${hashtagsKey}[${idx}].followCount`]: this.data.hashtags[idx].followCount - 1,
        })
      }
      return
    }
  },
  onClickHashtagBlock: async function (e) {
    const hashtagsKey = 'hashtags';
    const hashtag = e.currentTarget.dataset.hashtag;
    // 当前未关注，点击关注
    if (hashtag.blockStatus === 0) {
      const res = await this.actionBlock(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].blockStatus`]: 1,
          [`${hashtagsKey}[${idx}].blockCount`]: this.data.hashtags[idx].blockCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (hashtag.blockStatus === 1) {
      const res = await this.actionUnBlock(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`${hashtagsKey}[${idx}].blockStatus`]: 0,
          [`${hashtagsKey}[${idx}].blockCount`]: this.data.hashtags[idx].blockCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return fresnsApi.user.userMark({
      type: 1,
      markType: 1,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return fresnsApi.user.userMark({
      type: 2,
      markType: 1,
      markTarget: 3,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return fresnsApi.user.userMark({
      type: 1,
      markType: 2,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return fresnsApi.user.userMark({
      type: 2,
      markType: 2,
      markTarget: 3,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return fresnsApi.user.userMark({
      type: 1,
      markType: 3,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return fresnsApi.user.userMark({
      type: 2,
      markType: 3,
      markTarget: 3,
      markId: id,
    })
  },
}
