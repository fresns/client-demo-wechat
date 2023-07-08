/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction, callPrevPageFunction, truncateText } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    type: String,
    comment: Object,
  },

  /** 组件的初始数据 **/
  data: {
    title: null,
    showCommentBox: false,
    showShareActionSheet: false,
    shareActionGroups: [
      { text: '复制链接', value: 'onShareCopyLink' },
      { text: '分享给好友', value: 'onShareAppMessage' },
      { text: '分享到朋友圈', value: 'onShareTimeline' },
    ],
    actionGroups: [],
    showActionSheet: false,
  },

  /** 组件数据字段监听器 **/
  observers: {
    comment: async function (comment) {
      if (!comment) {
        return;
      }
      const userDeactivate = await fresnsLang('userDeactivate');
      const authorAnonymous = await fresnsLang('contentAuthorAnonymous');
      const fsEdit = await fresnsLang('edit');
      const fsDelete = await fresnsLang('delete');

      let nickname = comment.author.nickname;

      if (!comment.author.status) {
        nickname = userDeactivate;
      } else if (comment.isAnonymous) {
        nickname = authorAnonymous;
      }

      let items = [];

      // 编辑
      if (comment.editControls.isMe && comment.editControls.canEdit) {
        items.push({
          text: fsEdit,
          type: 'default',
          value: 'edit',
        });
      }

      // 删除
      if (comment.editControls.isMe && comment.editControls.canDelete) {
        items.push({
          text: fsDelete,
          type: 'warn',
          value: 'delete',
        });
      }

      // 关注
      if (comment.interaction.followSetting) {
        items.push({
          text: comment.interaction.followStatus
            ? '✔ ' + comment.interaction.followName
            : comment.interaction.followName,
          type: 'default',
          value: 'follow',
        });
      }

      // 屏蔽
      if (comment.interaction.blockSetting) {
        items.push({
          text: comment.interaction.blockStatus ? '✔ ' + comment.interaction.blockName : comment.interaction.blockName,
          type: 'warn',
          value: 'block',
        });
      }

      // 管理扩展
      if (comment.manages && comment.manages.length > 0) {
        for (let i = 0; i < comment.manages.length; i++) {
          const plugin = comment.manages[i];
          items.push({
            text: plugin.name,
            type: 'default',
            value: plugin.url,
          });
        }
      }

      this.setData({
        title: nickname + ': ' + truncateText(comment.content, 20),
        actionGroups: items,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 评论
    onClickCreateComment() {
      this.setData({
        showCommentBox: true,
      });
    },

    // 分享
    onClickShare() {
      this.setData({
        showShareActionSheet: true,
      });
    },
    actionClickShare(e) {
      const value = e.detail.value;

      // 复制链接
      if (value === 'onShareCopyLink') {
        wx.setClipboardData({
          data: this.data.postUrl,
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
          },
        });
      }

      // 分享给好友
      if (value === 'onShareAppMessage') {
        // this.data.postPage
      }

      // 分享到朋友圈
      if (value === 'onShareTimeline') {
        // this.data.postPage
      }

      this.setData({
        showShareActionSheet: false,
      });
    },

    // 更多菜单
    onClickContentMore() {
      this.setData({
        showActionSheet: true,
      });
    },
    actionClickMore(e) {
      const value = e.detail.value;

      // 关注
      if (value === 'follow') {
        this.onClickCommentFollow();
      }

      // 屏蔽
      if (value === 'block') {
        this.onClickCommentBlock();
      }

      this.setData({
        showActionSheet: false,
      });
    },

    /** 以下是互动功能 **/

    // 赞
    onClickCommentLike: async function () {
      const comment = this.data.comment;
      const initialComment = JSON.parse(JSON.stringify(this.data.comment)); // 拷贝一个小组初始数据

      if (comment.interaction.likeStatus) {
        comment.interaction.likeStatus = false; // 取消赞
        comment.likeCount = comment.likeCount ? comment.likeCount - 1 : comment.likeCount; // 计数减一
      } else {
        comment.interaction.likeStatus = true; // 赞
        comment.likeCount = comment.likeCount + 1; // 计数加一

        if (comment.interaction.dislikeStatus) {
          comment.interaction.dislikeStatus = false; // 取消踩
          comment.dislikeCount = comment.dislikeCount ? comment.dislikeCount - 1 : comment.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);
      callPrevPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'like',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
        callPrevPageFunction('onChangeComment', initialComment);
      }
    },

    // 踩
    onClickCommentDislike: async function () {
      const comment = this.data.comment;
      const initialComment = JSON.parse(JSON.stringify(this.data.comment)); // 拷贝一个小组初始数据

      if (comment.interaction.dislikeStatus) {
        comment.interaction.dislikeStatus = false; // 取消踩
        comment.dislikeCount = comment.dislikeCount ? comment.dislikeCount - 1 : comment.dislikeCount; // 计数减一
      } else {
        comment.interaction.dislikeStatus = true; // 踩
        comment.dislikeCount = comment.dislikeCount + 1; // 计数加一

        if (comment.interaction.likeStatus) {
          comment.interaction.likeStatus = false; // 取消赞
          comment.likeCount = comment.likeCount ? comment.likeCount - 1 : comment.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);
      callPrevPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'dislike',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
        callPrevPageFunction('onChangeComment', initialComment);
      }
    },

    // 关注
    onClickCommentFollow: async function () {
      const comment = this.data.comment;
      const initialComment = JSON.parse(JSON.stringify(this.data.comment)); // 拷贝一个小组初始数据

      if (comment.interaction.followStatus) {
        comment.interaction.followStatus = false; // 取消关注
        comment.followCount = comment.followCount ? comment.followCount - 1 : comment.followCount; // 计数减一
      } else {
        comment.interaction.followStatus = true; // 关注
        comment.followCount = comment.followCount + 1; // 计数加一

        if (comment.interaction.blockStatus) {
          comment.interaction.blockStatus = false; // 取消屏蔽
          comment.blockCount = comment.blockCount ? comment.blockCount - 1 : comment.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);
      callPrevPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'follow',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
        callPrevPageFunction('onChangeComment', initialComment);
      }
    },

    // 屏蔽
    onClickCommentBlock: async function () {
      const comment = this.data.comment;
      const initialComment = JSON.parse(JSON.stringify(this.data.comment)); // 拷贝一个小组初始数据

      if (comment.interaction.blockStatus) {
        comment.interaction.blockStatus = false; // 取消屏蔽
        comment.blockCount = comment.blockCount ? comment.blockCount - 1 : comment.blockCount; // 计数减一
      } else {
        comment.interaction.blockStatus = true; // 屏蔽
        comment.blockCount = comment.blockCount + 1; // 计数加一

        if (comment.interaction.followStatus) {
          comment.interaction.followStatus = false; // 取消关注
          comment.followCount = comment.followCount ? comment.followCount - 1 : comment.followCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);
      callPrevPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'block',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
        callPrevPageFunction('onChangeComment', initialComment);
      }
    },
  },
});
