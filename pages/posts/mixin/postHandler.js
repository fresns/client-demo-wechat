import Api from '../../../api/api'

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.成员 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
  actionLike: async function (id) {
    console.log('like')
    return Api.member.memberMark({
      type: 1,
      markType: 1,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnLike: async function () {
    console.log('unlike')
    return Api.member.memberMark({
      type: 2,
      markType: 1,
      markTarget: 4,
      markId: id,
    })
  },
  actionFollow: async function () {
    console.log('action follow')
    return Api.member.memberMark({
      type: 1,
      markType: 2,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnFollow: async function () {
    console.log('action unfollow')
    return Api.member.memberMark({
      type: 2,
      markType: 2,
      markTarget: 4,
      markId: id,
    })
  },
  actionBlock: async function () {
    console.log('action block')
    return Api.member.memberMark({
      type: 1,
      markType: 3,
      markTarget: 4,
      markId: id,
    })
  },
  actionUnBlock: async function () {
    console.log('action unblock')
    return Api.member.memberMark({
      type: 2,
      markType: 3,
      markTarget: 4,
      markId: id,
    })
  },
}