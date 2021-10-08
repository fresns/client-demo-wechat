import Api from '../../../api/api'

module.exports = {
  data: {
    curMember: null,
  },
  onLoad: async function (options) {
    const { mid } = options
    const memberDetailRes = await Api.member.memberDetail({
      viewMid: mid,
    })
    if (memberDetailRes.code === 0) {
      this.setData({
        curMember: memberDetailRes.data.detail,
      })
    }
  }
}
