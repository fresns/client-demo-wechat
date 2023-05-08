/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: Object,
  },

  /** 组件的初始数据 **/
  data: {
    fsid: '',
    interactions: [],
    likes: [],
    dislikes: [],
    following: [],
    blocking: [],
    showActionSheet: false,
    title: '',
    groups: [],
  },

  /** 组件数据字段监听器 **/
  observers: {
    user: async function (user) {
      if (!user) {
        return;
      }

      const fsid = user.fsid;

      const interactions = [
        {
          text: await fresnsConfig('menu_profile_followers_you_follow'),
          value: '/pages/profile/interactions/followers-you-follow?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_likes'),
          value: '/pages/profile/interactions/likers?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_dislikes'),
          value: '/pages/profile/interactions/dislikers?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_followers'),
          value: '/pages/profile/interactions/followers?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_blockers'),
          value: '/pages/profile/interactions/blockers?fsid=' + fsid,
        },
      ];

      const likes = [
        {
          text: await fresnsConfig('menu_profile_like_users'),
          value: '/pages/profile/likes/users?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_like_groups'),
          value: '/pages/profile/likes/groups?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_like_hashtags'),
          value: '/pages/profile/likes/hashtags?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_like_posts'),
          value: '/pages/profile/likes/posts?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_like_comments'),
          value: '/pages/profile/likes/comments?fsid=' + fsid,
        },
      ];

      const dislikes = [
        {
          text: await fresnsConfig('menu_profile_dislike_users'),
          value: '/pages/profile/dislikes/users?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_dislike_groups'),
          value: '/pages/profile/dislikes/groups?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_dislike_hashtags'),
          value: '/pages/profile/dislikes/hashtags?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_dislike_posts'),
          value: '/pages/profile/dislikes/posts?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_dislike_comments'),
          value: '/pages/profile/dislikes/comments?fsid=' + fsid,
        },
      ];

      const following = [
        {
          text: await fresnsConfig('menu_profile_follow_users'),
          value: '/pages/profile/following/users?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_follow_groups'),
          value: '/pages/profile/following/groups?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_follow_hashtags'),
          value: '/pages/profile/following/hashtags?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_follow_posts'),
          value: '/pages/profile/following/posts?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_follow_comments'),
          value: '/pages/profile/following/comments?fsid=' + fsid,
        },
      ];

      const blocking = [
        {
          text: await fresnsConfig('menu_profile_block_users'),
          value: '/pages/profile/blocking/users?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_block_groups'),
          value: '/pages/profile/blocking/groups?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_block_hashtags'),
          value: '/pages/profile/blocking/hashtags?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_block_posts'),
          value: '/pages/profile/blocking/posts?fsid=' + fsid,
        },
        {
          text: await fresnsConfig('menu_profile_block_comments'),
          value: '/pages/profile/blocking/comments?fsid=' + fsid,
        },
      ];

      this.setData({
        fsid: fsid,
        interactions: interactions,
        likes: likes,
        dislikes: dislikes,
        following: following,
        blocking: blocking,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onClickToPosts() {
      wx.redirectTo({
        url: '/pages/profile/posts?fsid=' + this.data.fsid,
      })
    },
    onClickToComments() {
      wx.redirectTo({
        url: '/pages/profile/comments?fsid=' + this.data.fsid,
      })
    },

    // 菜单
    onClickInteractions() {
      this.setData({
        title: '互动',
        groups: this.data.interactions,
        showActionSheet: true
      })
    },
    onClickLikes() {
      this.setData({
        title: '赞',
        groups: this.data.likes,
        showActionSheet: true
      })
    },
    onClickDislikes() {
      this.setData({
        title: '踩',
        groups: this.data.dislikes,
        showActionSheet: true
      })
    },
    onClickFollowing() {
      this.setData({
        title: '关注',
        groups: this.data.following,
        showActionSheet: true
      })
    },
    onClickBlocking() {
      this.setData({
        title: '屏蔽',
        groups: this.data.blocking,
        showActionSheet: true
      })
    },

    // 选项
    btnClick(e) {
      console.log(e);

      wx.redirectTo({
        url: e.detail.value,
      })

      this.setData({
        showActionSheet: false
      })
    },
  },
})
