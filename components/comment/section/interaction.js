/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction, truncateText } from '../../../utils/fresnsUtilities';

const app = getApp();

Component({
  /** 组件的属性列表 **/
  properties: {
    type: String,
    comment: Object,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: {},
    title: null,

    showCommentBox: false,
    nickname: null,

    showShareActionSheet: false,

    actionGroups: [],
    showActionSheet: false,

    buttonIcons: {
      like: '/assets/interaction/content-like.png',
      likeActive: '/assets/interaction/content-like-active.png',
      dislike: '/assets/interaction/content-dislike.png',
      dislikeActive: '/assets/interaction/content-dislike-active.png',
      follow: '/assets/interaction/follow.png',
      followActive: '/assets/interaction/follow-active.png',
      block: '/assets/interaction/block.png',
      blockActive: '/assets/interaction/block-active.png',
      comment: '/assets/interaction/content-comment.png',
      commentActive: '/assets/interaction/content-comment.png',
      share: '/assets/interaction/content-share.png',
      shareActive: '/assets/interaction/content-share.png',
      more: '/assets/interaction/content-more.png',
      moreActive: '/assets/interaction/content-more.png',
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsLang: await fresnsLang(),
      });
    },
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
        nickname: nickname,
        actionGroups: items,
      });

      // buttonIcons
      const checkButtonIcons = post.operations && post.operations.buttonIcons;
      if (checkButtonIcons) {
        const ButtonIconsArr = post.operations.buttonIcons;
        const likeItem = ButtonIconsArr.find((item) => item.code === 'like');
        const dislikeItem = ButtonIconsArr.find((item) => item.code === 'dislike');
        const followItem = ButtonIconsArr.find((item) => item.code === 'follow');
        const blockItem = ButtonIconsArr.find((item) => item.code === 'block');
        const commentItem = ButtonIconsArr.find((item) => item.code === 'comment');
        const shareItem = ButtonIconsArr.find((item) => item.code === 'share');
        const moreItem = ButtonIconsArr.find((item) => item.code === 'more');

        const buttonIcons = {
          like: likeItem ? likeItem.imageUrl : '/assets/interaction/content-like.png',
          likeActive: likeItem ? likeItem.imageActiveUrl : '/assets/interaction/content-like-active.png',
          dislike: dislikeItem ? dislikeItem.imageUrl : '/assets/interaction/content-dislike.png',
          dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : '/assets/interaction/content-dislike-active.png',
          follow: followItem ? followItem.imageUrl : '/assets/interaction/follow.png',
          followActive: followItem ? followItem.imageActiveUrl : '/assets/interaction/follow-active.png',
          block: blockItem ? blockItem.imageUrl : '/assets/interaction/block.png',
          blockActive: blockItem ? blockItem.imageActiveUrl : '/assets/interaction/block-active.png',
          comment: commentItem ? commentItem.imageUrl : '/assets/interaction/content-comment.png',
          commentActive: commentItem ? commentItem.imageActiveUrl : '/assets/interaction/content-comment.png',
          share: shareItem ? shareItem.imageUrl : '/assets/interaction/content-share.png',
          shareActive: shareItem ? shareItem.imageActiveUrl : '/assets/interaction/content-share.png',
          more: moreItem ? moreItem.imageUrl : '/assets/interaction/content-more.png',
          moreActive: moreItem ? moreItem.imageActiveUrl : '/assets/interaction/content-more.png',
        };

        this.setData({
          buttonIcons: buttonIcons,
        });
      }
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

    // 评论框隐藏
    eventCommentBoxHide: function () {
      this.setData({
        showCommentBox: false,
      });
    },

    // 分享
    onShowShareMenus() {
      this.setData({
        showShareActionSheet: true,
      });
    },
    onHideShareMenus() {
      this.setData({
        showShareActionSheet: false,
      });
    },

    // 分享功能
    onShareCopyLink() {
      const comment = this.data.comment;
      const copySuccess = this.data.fresnsLang.copySuccess;

      wx.setClipboardData({
        data: comment.url,
        success: function (res) {
          wx.showToast({
            title: copySuccess,
          });
        },
      });

      this.setData({
        showShareActionSheet: true,
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
      const comment = this.data.comment;

      // 编辑
      if (value === 'edit') {
        wx.navigateTo({
          url: '/pages/editor/index?type=comment&fsid=' + comment.cid,
        });

        this.setData({
          showActionSheet: false,
        });
      }

      // 删除
      if (value === 'delete') {
        // mixins/fresnsInteraction.js
        callPageFunction('onDeleteComment', comment.cid);

        this.setData({
          showActionSheet: false,
        });
      }

      // 关注
      if (value === 'follow') {
        this.onClickCommentFollow();
      }

      // 屏蔽
      if (value === 'block') {
        this.onClickCommentBlock();
      }

      // 扩展插件
      if (value.startsWith('http')) {
        const fresnsExtensions = {
          type: 'comment',
          scene: 'manage',
          postMessageKey: 'fresnsCommentManage',
          cid: comment.cid,
          uid: comment.author.uid,
          title: 'Fresns Manage',
          url: value,
        };

        app.globalData.fresnsExtensions = fresnsExtensions;

        wx.navigateTo({
          url: '/pages/webview',
        });
      }
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

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'like',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
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

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'dislike',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
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

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'follow',
        markType: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
      }
    },

    // 屏蔽
    onClickCommentBlock: async function () {
      const comment = this.data.comment;
      const initialComment = JSON.parse(JSON.stringify(this.data.comment)); // 拷贝一个小组初始数据

      // 取消屏蔽
      if (comment.interaction.blockStatus) {
        comment.interaction.blockStatus = false; // 取消屏蔽
        comment.blockCount = comment.blockCount ? comment.blockCount - 1 : comment.blockCount; // 计数减一

        // mixins/fresnsInteraction.js
        callPageFunction('onChangeComment', comment);

        const resultRes = await fresnsApi.user.userMark({
          interactionType: 'block',
          markType: 'comment',
          fsid: comment.cid,
        });

        // 接口请求失败，数据还原
        if (resultRes.code != 0) {
          callPageFunction('onChangeComment', initialComment);
        }

        return;
      }

      // 屏蔽操作，二次确认
      wx.showModal({
        title: comment.interaction.blockName,
        cancelText: await fresnsLang('cancel'),
        confirmText: await fresnsLang('confirm'),

        success: async (res) => {
          // 确认
          if (res.confirm) {
            comment.interaction.blockStatus = true; // 屏蔽
            comment.blockCount = comment.blockCount + 1; // 计数加一

            if (comment.interaction.followStatus) {
              comment.interaction.followStatus = false; // 取消关注
              comment.followCount = comment.followCount ? comment.followCount - 1 : comment.followCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangeComment', comment);

            const resultRes = await fresnsApi.user.userMark({
              interactionType: 'block',
              markType: 'comment',
              fsid: comment.cid,
            });

            // 接口请求失败，数据还原
            if (resultRes.code != 0) {
              callPageFunction('onChangeComment', initialComment);
            }
          }
        },
      });
    },
  },
});
