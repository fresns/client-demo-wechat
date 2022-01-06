/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'
import Api from '../../api/api'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    // 草稿+审核拒绝
    postsStatusOne: {
      posts: [],
      page: 1,
      isReachBottom: false,
    },
    // 草稿+审核拒绝
    commentsStatusOne: {
      comments: [],
      page: 1,
      isReachBottom: false,
    },
  },
  onLoad: async function (options) {
    await this.loadPosts()
    // await this.loadComments()
  },
  loadPosts: async function () {
    const { postsStatusOne } = this.data

    const draftPostsOneRes = await Api.editor.editorLists({
      type: 1,
      status: 1,
      page: postsStatusOne.page,
    })

    if (draftPostsOneRes.code === 0) {
      this.setData({
        postsStatusOne: {
          posts: postsStatusOne.posts.concat(draftPostsOneRes.data.list),
          page: postsStatusOne.page + 1,
          isReachBottom: draftPostsOneRes.data.pagination.current === draftPostsOneRes.data.pagination.lastPage,
        },
      })
    }
  },
  loadComments: async function () {
    const { commentsStatusOne } = this.data

    const draftCommentsOneRes = await Api.editor.editorLists({
      type: 2,
      status: 1,
      page: commentsStatusOne.page,
    })

    if (draftCommentsOneRes.code === 0) {
      this.setData({
        commentsStatusOne: {
          comments: commentsStatusOne.comments.concat(draftCommentsOneRes.data.list),
          page: commentsStatusOne.page + 1,
          isReachBottom: draftCommentsOneRes.data.pagination.current === draftCommentsOneRes.data.pagination.lastPage,
        },
      })
    }
  },
  onReachBottom: async function () {
    const { postsStatusOne } = this.data

    if (postsStatusOne.isReachBottom) {
      return
    }

    const res = await Api.editor.editorLists({
      type: 1,
      status: 1,
      page: postsStatusOne.page,
    })
    this.setData({
      postsStatusOne: {
        posts: postsStatusOne.posts.concat(res.data.list),
        page: postsStatusOne.page + 1,
        isReachBottom: res.data.pagination.current === res.data.pagination.lastPage,
      },
    })

    // if (activeIndex === 1) {
    //   if (commentsStatusOne.isReachBottom) {
    //     return
    //   }
    //
    //   const res = await Api.editor.editorLists({
    //     type: 2,
    //     status: 1,
    //     page: commentsStatusOne.page,
    //   })
    //   this.setData({
    //     commentsStatusOne: {
    //       comments: commentsStatusOne.comments.concat(res.data.list),
    //       page: commentsStatusOne.page + 1,
    //       isReachBottom: res.data.pagination.current === res.data.pagination.lastPage,
    //     },
    //   })
    // }
  },
})
