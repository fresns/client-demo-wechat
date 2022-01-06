/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    tabs: ['帖子草稿', '评论草稿'],
    activeIndex: 0,
    FileGallery: false,

    // 草稿+审核拒绝
    postsStatusOne: {
      posts: [],
      page: 1,
      isReachBottom: false,
    },
    // 审核中
    // postsStatusTwo: {
    //   posts: [],
    //   page: 1,
    //   isReachBottom: false,
    // },

    // 草稿+审核拒绝
    commentsStatusOne: {
      comments: [],
      page: 1,
      isReachBottom: false,
    },
    // 审核中
    // commentsStatusTwo: {
    //   comments: [],
    //   page: 1,
    //   isReachBottom: false,
    // },
  },
  onLoad: async function (options) {
    await this.loadPosts()
    await this.loadComments()
  },
  loadPosts: async function () {
    const { postsStatusOne, postsStatusTwo } = this.data

    const [
      draftPostsOneRes,
      // draftPostsTwoRes
    ] = await Promise.all([
      Api.editor.editorLists({
        type: 1,
        status: 1,
        page: postsStatusOne.page,
      }),
      // Api.editor.editorLists({
      //   type: 1,
      //   status: 2,
      //   page: postsStatusTwo.page,
      // }),
    ])

    if (
      draftPostsOneRes.code === 0
      // && draftPostsTwoRes.code === 0
    ) {
      this.setData({
        postsStatusOne: {
          posts: postsStatusOne.posts.concat(draftPostsOneRes.data.list),
          page: postsStatusOne.page + 1,
          isReachBottom: draftPostsOneRes.data.pagination.current === draftPostsOneRes.data.pagination.lastPage,
        },
        // postsStatusTwo: {
        //   posts: postsStatusTwo.posts.concat(draftPostsOneRes.data.list),
        //   page: postsStatusTwo.page + 1,
        //   isReachBottom: draftPostsTwoRes.data.pagination.current === draftPostsTwoRes.data.pagination.lastPage,
        // },
      })
    }
  },
  loadComments: async function () {
    const { commentsStatusOne, commentsStatusTwo } = this.data

    const [
      draftCommentsOneRes,
      // draftCommentsTwoRes
    ] = await Promise.all([
      Api.editor.editorLists({
        type: 2,
        status: 1,
        page: commentsStatusOne.page,
      }),
      // Api.editor.editorLists({
      //   type: 2,
      //   status: 2,
      //   page: commentsStatusTwo.page,
      // }),
    ])

    if (
      draftCommentsOneRes.code === 0
      // && draftCommentsTwoRes.code === 0
    ) {
      this.setData({
        commentsStatusOne: {
          comments: commentsStatusOne.comments.concat(draftCommentsOneRes.data.list),
          page: commentsStatusOne.page + 1,
          isReachBottom: draftCommentsOneRes.data.pagination.current === draftCommentsOneRes.data.pagination.lastPage,
        },
        // commentsStatusTwo: {
        //   comments: commentsStatusTwo.comments.concat(draftPostsOneRes.data.list),
        //   page: commentsStatusTwo.page + 1,
        //   isReachBottom: draftCommentsTwoRes.data.pagination.current === draftCommentsTwoRes.data.pagination.lastPage,
        // },
      })
    }
  },
  onReachBottom: async function () {
    const { activeIndex, postsStatusOne, commentsStatusOne } = this.data

    if (activeIndex === 0) {
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
    }

    if (activeIndex === 1) {
      if (commentsStatusOne.isReachBottom) {
        return
      }

      const res = await Api.editor.editorLists({
        type: 2,
        status: 1,
        page: commentsStatusOne.page,
      })
      this.setData({
        commentsStatusOne: {
          comments: commentsStatusOne.comments.concat(res.data.list),
          page: commentsStatusOne.page + 1,
          isReachBottom: res.data.pagination.current === res.data.pagination.lastPage,
        },
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
    })
  },
})
