/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

import { globalInfo } from '../../handler/globalInfo'
import Api from '../../api/api'

/**
 * 我屏蔽的成员
 */
Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('./mixin/memberHandler'),
  ],
  data: {
    // 当前页面数据
    members: [],
    // 下次请求时候的页码，初始值为 1
    page: 1,
    // 页面是否到底
    isReachBottom: false,
  },
  onLoad: async function () {
    await this._loadCurPageData()
  },
  _loadCurPageData: async function () {
    if (this.data.isReachBottom) {
      return
    }

    const resultRes = await Api.member.memberMarkLists({
      viewMid: globalInfo.currentMemberId,
      viewType: 3,
      viewTarget: 1,
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        members: this.data.members.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onClickLike: async function (e) {
    const { member } = e.currentTarget.dataset

    // 当前未喜欢，点击喜欢
    if (member.likeStatus === 0) {
      const res = await this.actionLike(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].likeStatus`]: 1,
          [`members[${idx}].stats.likeMemberCount`]: this.data.members[idx].stats.likeMemberCount + 1,
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
          [`members[${idx}].stats.likeMemberCount`]: this.data.members[idx].stats.likeMemberCount - 1,
        })
      }
      return
    }
  },
  onClickFollow: async function (e) {
    const { member } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (member.followStatus === 0) {
      const res = await this.actionFollow(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].followStatus`]: 1,
          [`members[${idx}].stats.followMemberCount`]: this.data.members[idx].stats.followMemberCount + 1,
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
          [`members[${idx}].stats.followMemberCount`]: this.data.members[idx].stats.followMemberCount - 1,
        })
      }
      return
    }
  },
  onClickBlock: async function (e) {
    const { member } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (member.shieldStatus === 0) {
      const res = await this.actionBlock(member.mid)
      if (res.code === 0) {
        const idx = this.data.members.findIndex(value => value.mid === member.mid)
        this.setData({
          [`members[${idx}].shieldStatus`]: 1,
          [`members[${idx}].stats.shieldMemberCount`]: this.data.members[idx].stats.shieldMemberCount + 1,
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
          [`members[${idx}].stats.shieldMemberCount`]: this.data.members[idx].stats.shieldMemberCount - 1,
        })
      }
      return
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
})
