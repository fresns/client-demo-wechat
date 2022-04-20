/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../../configs/fresnsGlobalInfo'
import Api from '../../api/api'

/**
 * 我屏蔽的用户
 */
Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixin/themeChanged'),
    require('../../mixin/loginInterceptor'),
    require('../../mixin/handler/userHandler'),
  ],
  data: {
    // 当前页面数据
    users: [],
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

    const resultRes = await Api.user.userMarkLists({
      viewUid: globalInfo.currentUserId,
      viewType: 3,
      viewTarget: 1,
      page: this.data.page,
    })

    if (resultRes.code === 0) {
      const { pagination, list } = resultRes.data
      this.setData({
        users: this.data.users.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.current === pagination.lastPage,
      })
    }
  },
  onClickLike: async function (e) {
    const { user } = e.currentTarget.dataset

    // 当前未喜欢，点击喜欢
    if (user.likeStatus === 0) {
      const res = await this.actionLike(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`users[${idx}].likeStatus`]: 1,
          [`users[${idx}].stats.likeUserCount`]: this.data.users[idx].stats.likeUserCount + 1,
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
          [`users[${idx}].likeStatus`]: 0,
          [`users[${idx}].stats.likeUserCount`]: this.data.users[idx].stats.likeUserCount - 1,
        })
      }
      return
    }
  },
  onClickFollow: async function (e) {
    const { user } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (user.followStatus === 0) {
      const res = await this.actionFollow(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`users[${idx}].followStatus`]: 1,
          [`users[${idx}].stats.followUserCount`]: this.data.users[idx].stats.followUserCount + 1,
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
          [`users[${idx}].followStatus`]: 0,
          [`users[${idx}].stats.followUserCount`]: this.data.users[idx].stats.followUserCount - 1,
        })
      }
      return
    }
  },
  onClickBlock: async function (e) {
    const { user } = e.currentTarget.dataset

    // 当前未关注，点击关注
    if (user.blockStatus === 0) {
      const res = await this.actionBlock(user.uid)
      if (res.code === 0) {
        const idx = this.data.users.findIndex(value => value.uid === user.uid)
        this.setData({
          [`users[${idx}].blockStatus`]: 1,
          [`users[${idx}].stats.blockUserCount`]: this.data.users[idx].stats.blockUserCount + 1,
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
          [`users[${idx}].blockStatus`]: 0,
          [`users[${idx}].stats.blockUserCount`]: this.data.users[idx].stats.blockUserCount - 1,
        })
      }
      return
    }
  },
  onReachBottom: async function () {
    await this._loadCurPageData()
  },
})
