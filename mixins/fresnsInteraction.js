/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { dfs } from '../utils/fresnsUtilities';

module.exports = {
  /** 更改用户 **/
  onChangeUser(newUser) {
    // 详情页
    const profile = this.data.profile;

    if (profile) {
      if (profile.uid != newUser.uid) {
        return;
      }

      this.setData({
        profile: newUser,
      });

      return;
    }

    // 列表页
    const users = this.data.users;
    if (!users) {
      return;
    }

    const idx = users.findIndex((value) => value.uid === newUser.uid);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    users[idx] = newUser;

    this.setData({
      users: users,
    });
  },

  /** 更改小组 **/
  onChangeGroup(newGroup) {
    // 详情页
    const group = this.data.group;

    if (group) {
      if (group.gid != newGroup.gid) {
        return;
      }

      this.setData({
        group: newGroup,
      });

      return;
    }

    // 列表页
    const groups = this.data.groups;
    if (!groups) {
      return;
    }

    const idx = groups.findIndex((value) => value.gid === newGroup.gid);

    if (idx !== -1) {
      // 找到了小组
      groups[idx] = newGroup;

      this.setData({
        groups: groups,
      });

      return;
    }

    // 树结构页
    const groupTree = this.data.groupTree;
    if (!groupTree) {
      return;
    }

    const newGroupTree = groupTree.map((tree) => dfs(tree, newGroup.gid, newGroup));

    this.setData({
      groupTree: newGroupTree,
    });
  },

  /** 更改话题 **/
  onChangeHashtag(newHashtag) {
    // 详情页
    const hashtag = this.data.hashtag;

    if (hashtag) {
      if (hashtag.hid != newHashtag.hid) {
        return;
      }

      this.setData({
        hashtag: newHashtag,
      });

      return;
    }

    // 列表页
    const hashtags = this.data.hashtags;
    if (!hashtags) {
      return;
    }

    const idx = hashtags.findIndex((value) => value.hid === newHashtag.hid);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    hashtags[idx] = newHashtag;

    this.setData({
      hashtags: hashtags,
    });
  },

  /** 更改帖子 **/
  onChangePost(newPost) {
    // 详情页
    const post = this.data.post;

    if (post) {
      if (post.pid != newPost.pid) {
        return;
      }

      this.setData({
        post: newPost,
      });

      return;
    }

    // 列表页
    const posts = this.data.posts;
    if (!posts) {
      return;
    }

    const idx = posts.findIndex((value) => value.pid === newPost.pid);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    posts[idx] = newPost;

    this.setData({
      posts: posts,
    });
  },

  /** 更改评论 **/
  onChangeComment(newComment) {
    // 详情页
    const comment = this.data.comment;

    if (comment) {
      if (comment.cid != newComment.cid) {
        return;
      }

      this.setData({
        comment: newComment,
      });

      return;
    }

    // 列表页
    const comments = this.data.comments;
    if (!comments) {
      return;
    }

    const idx = comments.findIndex((value) => value.cid === newComment.cid);

    if (idx == -1) {
      // 未找到记录
      return;
    }

    comments[idx] = newComment;

    this.setData({
      comments: comments,
    });
  },
};
