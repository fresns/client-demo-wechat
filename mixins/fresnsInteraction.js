/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { globalInfo } from '../utils/fresnsGlobalInfo';
import { getCurrentPagePath, dfs } from '../utils/fresnsUtilities';

module.exports = {
  /** 右上角菜单-分享给好友 **/
  onShareAppMessage: async function (res) {
    console.log('onShareAppMessage res', res);

    let shareTitle = this.data.title;
    let sharePath = getCurrentPagePath();

    if (res.from == 'button') {
      const type = res.target.dataset.type;
      const fsid = res.target.dataset.fsid;
      const title = res.target.dataset.title;

      switch (type) {
        case 'user':
          const userHomePath = await globalInfo.userHomePath();
          sharePath = userHomePath + fsid;
          break;

        case 'group':
          sharePath = '/pages/groups/detail?gid=' + fsid;
          break;

        case 'hashtag':
          sharePath = '/pages/hashtags/detail?hid=' + fsid;
          break;

        case 'post':
          sharePath = '/pages/posts/detail?pid=' + fsid;
          break;

        case 'comment':
          sharePath = '/pages/comments/detail?cid=' + fsid;
          break;

        default:
        // code
      }

      shareTitle = title;
    }

    console.log('onShareAppMessage', shareTitle, sharePath);

    return {
      title: shareTitle,
      path: sharePath,
    };
  },

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

  /** 发表评论 **/
  onPublishCommentAction: async function (data) {
    const commentPid = data.commentPid;
    const commentCid = data.commentCid;
    const newCid = data.newCid;

    // 帖子的评论总数 +1
    if (commentPid) {
      // 详情页
      const postDetail = this.data.post;
      if (postDetail) {
        postDetail.commentCount = postDetail.commentCount + 1;

        this.setData({
          post: postDetail,
        });
      }

      // 列表页
      const posts = this.data.posts;
      if (posts) {
        const postIdx = posts.findIndex((value) => value.pid === commentPid);

        if (postIdx >= 0) {
          posts[postIdx].commentCount = posts[postIdx].commentCount + 1;

          this.setData({
            posts: posts,
          });
        }
      }
    }

    const comments = this.data.comments;
    if (comments) {
      // 发表成功，插入新评论
      const commentDetailRes = await fresnsApi.comment.commentDetail({
        cid: newCid,
      });
      if (commentDetailRes.code === 0) {
        let detail = commentDetailRes.data.detail;
        detail.replyToPost = {
          pid: detail.replyToPost.pid,
        };

        comments.unshift(detail);
      }

      // 涉及父级评论，父级评论总数 +1
      if (commentCid) {
        const commentIdx = comments.findIndex((value) => value.cid === commentCid);

        if (commentIdx >= 0) {
          comments[commentIdx].commentCount = comments[commentIdx].commentCount + 1;
        }
      }

      // 隐藏评论框
      this.setData({
        comments: comments,
      });
    }

    // 隐藏评论框
    this.setData({
      showCommentBox: false,
    });
  },

  /** 删除帖子 **/
  onDeletePost: async function (deletePid) {
    // 详情页
    const postDetail = this.data.post;
    if (postDetail && postDetail.pid == deletePid) {
      const resultRes = await fresnsApi.post.postDelete({
        pid: deletePid,
      });

      if (resultRes.code === 0) {
        wx.navigateBack({
          delta: 1,
        });
      }
    }

    // 列表页
    const posts = this.data.posts;
    if (posts) {
      const idx = posts.findIndex((value) => value.pid === deletePid);

      if (idx == -1) {
        // 未找到记录
        return;
      }

      const resultRes = await fresnsApi.post.postDelete({
        pid: deletePid,
      });

      if (resultRes.code === 0) {
        posts.splice(idx, 1);

        this.setData({
          posts: posts,
        });
      }
    }
  },

  /** 删除评论 **/
  onDeleteComment: async function (deleteCid) {
    // 详情页
    const commentDetail = this.data.comment;
    if (commentDetail && commentDetail.cid == deleteCid) {
      const resultRes = await fresnsApi.comment.commentDelete({
        cid: deleteCid,
      });

      if (resultRes.code === 0) {
        wx.navigateBack({
          delta: 1,
        });
      }
    }

    // 列表页
    const comments = this.data.comments;
    if (comments) {
      const idx = comments.findIndex((value) => value.cid === deleteCid);

      if (idx == -1) {
        // 未找到记录
        return;
      }

      const resultRes = await fresnsApi.comment.commentDelete({
        cid: deleteCid,
      });

      if (resultRes.code === 0) {
        comments.splice(idx, 1);

        this.setData({
          comments: comments,
        });
      }
    }
  },
};
