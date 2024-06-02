/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../sdk/helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    postEnabled: true,
    postName: '帖子',
    commentEnabled: true,
    commentName: '评论',
    fsid: null,
    likes: [],
    dislikes: [],
    following: [],
    blocking: [],
    interactions: [],
  },

  /** 组件数据字段监听器 **/
  observers: {
    user: async function (user) {
      if (!user) {
        return;
      }

      const fsid = user.fsid;

      const likes = [
        {
          status: await fresnsConfig('profile_likes_users_enabled'),
          text: await fresnsConfig('profile_likes_users_name'),
          link: '/pages/profile/likes/users?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_likes_groups_enabled'),
          text: await fresnsConfig('profile_likes_groups_name'),
          link: '/pages/profile/likes/groups?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_likes_hashtags_enabled'),
          text: await fresnsConfig('profile_likes_hashtags_name'),
          link: '/pages/profile/likes/hashtags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_likes_geotags_enabled'),
          text: await fresnsConfig('profile_likes_geotags_name'),
          link: '/pages/profile/likes/geotags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_likes_posts_enabled'),
          text: await fresnsConfig('profile_likes_posts_name'),
          link: '/pages/profile/likes/posts?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_likes_comments_enabled'),
          text: await fresnsConfig('profile_likes_comments_name'),
          link: '/pages/profile/likes/comments?fsid=' + fsid,
        },
      ];

      const dislikes = [
        {
          status: await fresnsConfig('profile_dislikes_users_enabled'),
          text: await fresnsConfig('profile_dislikes_users_name'),
          link: '/pages/profile/dislikes/users?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_dislikes_groups_enabled'),
          text: await fresnsConfig('profile_dislikes_groups_name'),
          link: '/pages/profile/dislikes/groups?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_dislikes_hashtags_enabled'),
          text: await fresnsConfig('profile_dislikes_hashtags_name'),
          link: '/pages/profile/dislikes/hashtags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_dislikes_geotags_enabled'),
          text: await fresnsConfig('profile_dislikes_geotags_name'),
          link: '/pages/profile/dislikes/geotags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_dislikes_posts_enabled'),
          text: await fresnsConfig('profile_dislikes_posts_name'),
          link: '/pages/profile/dislikes/posts?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_dislikes_comments_enabled'),
          text: await fresnsConfig('profile_dislikes_comments_name'),
          link: '/pages/profile/dislikes/comments?fsid=' + fsid,
        },
      ];

      const following = [
        {
          status: await fresnsConfig('profile_following_users_enabled'),
          text: await fresnsConfig('profile_following_users_name'),
          link: '/pages/profile/following/users?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_following_groups_enabled'),
          text: await fresnsConfig('profile_following_groups_name'),
          link: '/pages/profile/following/groups?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_following_hashtags_enabled'),
          text: await fresnsConfig('profile_following_hashtags_name'),
          link: '/pages/profile/following/hashtags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_following_geotags_enabled'),
          text: await fresnsConfig('profile_following_geotags_name'),
          link: '/pages/profile/following/geotags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_following_posts_enabled'),
          text: await fresnsConfig('profile_following_posts_name'),
          link: '/pages/profile/following/posts?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_following_comments_enabled'),
          text: await fresnsConfig('profile_following_comments_name'),
          link: '/pages/profile/following/comments?fsid=' + fsid,
        },
      ];

      const blocking = [
        {
          status: await fresnsConfig('profile_blocking_users_enabled'),
          text: await fresnsConfig('profile_blocking_users_name'),
          link: '/pages/profile/blocking/users?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_blocking_groups_enabled'),
          text: await fresnsConfig('profile_blocking_groups_name'),
          link: '/pages/profile/blocking/groups?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_blocking_hashtags_enabled'),
          text: await fresnsConfig('profile_blocking_hashtags_name'),
          link: '/pages/profile/blocking/hashtags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_blocking_geotags_enabled'),
          text: await fresnsConfig('profile_blocking_geotags_name'),
          link: '/pages/profile/blocking/geotags?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_blocking_posts_enabled'),
          text: await fresnsConfig('profile_blocking_posts_name'),
          link: '/pages/profile/blocking/posts?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_blocking_comments_enabled'),
          text: await fresnsConfig('profile_blocking_comments_name'),
          link: '/pages/profile/blocking/comments?fsid=' + fsid,
        },
      ];

      const interactions = [
        {
          status: (await fresnsConfig('user_like_public_record')) != 1,
          text: await fresnsConfig('profile_likers_name'),
          link: '/pages/profile/interactions/likers?fsid=' + fsid,
        },
        {
          status: (await fresnsConfig('user_dislike_public_record')) != 1,
          text: await fresnsConfig('profile_dislikers_name'),
          link: '/pages/profile/interactions/dislikers?fsid=' + fsid,
        },
        {
          status: (await fresnsConfig('user_follow_public_record')) != 1,
          text: await fresnsConfig('profile_followers_name'),
          link: '/pages/profile/interactions/followers?fsid=' + fsid,
        },
        {
          status: (await fresnsConfig('user_block_public_record')) != 1,
          text: await fresnsConfig('profile_blockers_name'),
          link: '/pages/profile/interactions/blockers?fsid=' + fsid,
        },
        {
          status: await fresnsConfig('profile_followers_you_follow_enabled'),
          text: await fresnsConfig('profile_followers_you_follow_name'),
          link: '/pages/profile/interactions/followers-you-follow?fsid=' + fsid,
        },
      ];

      this.setData({
        fsid: fsid,
        likes: likes,
        dislikes: dislikes,
        following: following,
        blocking: blocking,
        interactions: interactions,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        postEnabled: await fresnsConfig('profile_posts_enabled'),
        postName: await fresnsConfig('post_name'),
        commentEnabled: await fresnsConfig('profile_comments_enabled'),
        commentName: await fresnsConfig('comment_name'),
        fresnsLang: {
          more: await fresnsLang('more'),
        },
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onClickToPosts() {
      wx.redirectTo({
        url: '/pages/profile/posts?fsid=' + this.data.fsid,
      });
    },

    onClickToComments() {
      wx.redirectTo({
        url: '/pages/profile/comments?fsid=' + this.data.fsid,
      });
    },

    onClickMenus(e) {
      const type = e.currentTarget.dataset.type;

      let itemList;
      let linkList;

      switch (type) {
        case 'likes':
          const likes = this.data.likes;

          itemList = likes.filter((item) => item.status).map((item) => item.text);
          linkList = likes.filter((item) => item.status).map((item) => item.link);
          break;

        case 'dislikes':
          const dislikes = this.data.dislikes;

          itemList = dislikes.filter((item) => item.status).map((item) => item.text);
          linkList = dislikes.filter((item) => item.status).map((item) => item.link);
          break;

        case 'following':
          const following = this.data.following;

          itemList = following.filter((item) => item.status).map((item) => item.text);
          linkList = following.filter((item) => item.status).map((item) => item.link);
          break;

        case 'blocking':
          const blocking = this.data.blocking;

          itemList = blocking.filter((item) => item.status).map((item) => item.text);
          linkList = blocking.filter((item) => item.status).map((item) => item.link);
          break;

        case 'interactions':
          const interactions = this.data.interactions;

          itemList = interactions.filter((item) => item.status).map((item) => item.text);
          linkList = interactions.filter((item) => item.status).map((item) => item.link);
          break;

        default:
          return;
      }

      wx.showActionSheet({
        itemList: itemList,
        success(res) {
          const tapIndex = res.tapIndex;

          const link = linkList[tapIndex];

          if (link) {
            wx.redirectTo({
              url: link,
            });
          }
        },
      });
    },
  },
});
