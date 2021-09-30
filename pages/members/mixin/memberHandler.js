import Api from '../../../api/api'

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.成员 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
  data: {},
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
