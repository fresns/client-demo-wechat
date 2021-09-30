import Api from '../../../api/api'

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.成员 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
  onClickLike: async function (e) {
    const { hashtag } = e.currentTarget.dataset

    // 当前未喜欢，点击喜欢
    if (hashtag.likeStatus === 0) {
      const res = await this.actionLike(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`hashtags[${idx}].likeStatus`]: 1,
          [`hashtags[${idx}].likeCount`]: this.data.hashtags[idx].likeCount + 1,
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
          [`hashtags[${idx}].likeStatus`]: 0,
          [`hashtags[${idx}].likeCount`]: this.data.hashtags[idx].likeCount - 1,
        })
      }
      return
    }
  },
  onClickFollow: async function (e) {
    const { hashtag } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (hashtag.followStatus === 0) {
      const res = await this.actionFollow(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`hashtags[${idx}].followStatus`]: 1,
          [`hashtags[${idx}].followCount`]: this.data.hashtags[idx].followCount + 1,
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
          [`hashtags[${idx}].followStatus`]: 0,
          [`hashtags[${idx}].followCount`]: this.data.hashtags[idx].followCount - 1,
        })
      }
      return
    }
  },
  onClickBlock: async function (e) {
    const { hashtag } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (hashtag.shieldStatus === 0) {
      const res = await this.actionBlock(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`hashtags[${idx}].shieldStatus`]: 1,
          [`hashtags[${idx}].shieldCount`]: this.data.hashtags[idx].shieldCount + 1,
        })
      }
      return
    }

    // 当前已关注，点击取消关注
    if (hashtag.shieldStatus === 1) {
      const res = await this.actionUnBlock(hashtag.huri)
      if (res.code === 0) {
        const idx = this.data.hashtags.findIndex(value => value.huri === hashtag.huri)
        this.setData({
          [`hashtags[${idx}].shieldStatus`]: 0,
          [`hashtags[${idx}].shieldCount`]: this.data.hashtags[idx].shieldCount - 1,
        })
      }
      return
    }
  },
  actionLike: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnLike: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 3,
      markId: id,
    })
  },
  actionFollow: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnFollow: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 3,
      markId: id,
    })
  },
  actionBlock: async function (id) {
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 3,
      markId: id,
    })
  },
  actionUnBlock: async function (id) {
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 3,
      markId: id,
    })
  },
}