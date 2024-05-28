/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../sdk/services';
import { fresnsClient } from '../../../sdk/helpers/client';
import { fresnsLang } from '../../../sdk/helpers/configs';
import { callPageFunction, truncateText } from '../../../sdk/utilities/toolkit';

Component({
  /** 组件的属性列表 **/
  properties: {
    viewType: {
      type: String,
      value: 'list', // list or detail
    },
    comment: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    appBaseInfo: {},
    enableSharePoster: false,
    fresnsLang: {},
    title: null,

    showCommentBox: false,
    commentDialogFullScreen: false,
    nickname: null,

    showShareSheet: false,
    showMoreSheet: false,

    buttonIcons: {
      like: 'https://assets.fresns.cn/communities/interaction/content-like.png',
      likeActive: 'https://assets.fresns.cn/communities/interaction/content-like-active.png',
      dislike: 'https://assets.fresns.cn/communities/interaction/content-dislike.png',
      dislikeActive: 'https://assets.fresns.cn/communities/interaction/content-dislike-active.png',
      follow: 'https://assets.fresns.cn/communities/interaction/follow.png',
      followActive: 'https://assets.fresns.cn/communities/interaction/follow-active.png',
      block: 'https://assets.fresns.cn/communities/interaction/block.png',
      blockActive: 'https://assets.fresns.cn/communities/interaction/block-active.png',
      comment: 'https://assets.fresns.cn/communities/interaction/content-comment.png',
      commentActive: 'https://assets.fresns.cn/communities/interaction/content-comment.png',
      share: 'https://assets.fresns.cn/communities/interaction/content-share.png',
      shareActive: 'https://assets.fresns.cn/communities/interaction/content-share.png',
      more: 'https://assets.fresns.cn/communities/interaction/content-more.png',
      moreActive: 'https://assets.fresns.cn/communities/interaction/content-more.png',
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const comment = this.data.comment;

      // buttonIcons
      const ButtonIconsArr = comment.operations.buttonIcons;
      if (ButtonIconsArr.length > 0) {
        const likeItem = ButtonIconsArr.find((item) => item.code === 'like');
        const dislikeItem = ButtonIconsArr.find((item) => item.code === 'dislike');
        const followItem = ButtonIconsArr.find((item) => item.code === 'follow');
        const blockItem = ButtonIconsArr.find((item) => item.code === 'block');
        const commentItem = ButtonIconsArr.find((item) => item.code === 'comment');
        const shareItem = ButtonIconsArr.find((item) => item.code === 'share');
        const moreItem = ButtonIconsArr.find((item) => item.code === 'more');

        const buttonIcons = {
          like: likeItem ? likeItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/content-like.png',
          likeActive: likeItem ? likeItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/content-like-active.png',
          dislike: dislikeItem ? dislikeItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/content-dislike.png',
          dislikeActive: dislikeItem ? dislikeItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/content-dislike-active.png',
          follow: followItem ? followItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/follow.png',
          followActive: followItem ? followItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/follow-active.png',
          block: blockItem ? blockItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/block.png',
          blockActive: blockItem ? blockItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/block-active.png',
          comment: commentItem ? commentItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/content-comment.png',
          commentActive: commentItem ? commentItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/content-comment.png',
          share: shareItem ? shareItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/content-share.png',
          shareActive: shareItem ? shareItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/content-share.png',
          more: moreItem ? moreItem.imageUrl : 'https://assets.fresns.cn/communities/interaction/content-more.png',
          moreActive: moreItem ? moreItem.imageActiveUrl : 'https://assets.fresns.cn/communities/interaction/content-more.png',
        };

        this.setData({
          buttonIcons: buttonIcons,
        });
      }

      let nickname = comment.author.nickname;

      if (!comment.author.status) {
        nickname = await fresnsLang('userDeactivate');
      } else if (comment.isAnonymous) {
        nickname = await fresnsLang('contentAuthorAnonymous');
      }

      const content = truncateText(comment.content, 20);

      this.setData({
        appBaseInfo: fresnsClient.appBaseInfo,
        enableSharePoster: fresnsClient.enableSharePoster,
        fresnsLang: {
          copyLink: await fresnsLang('copyLink'),
          shareMessage: await fresnsLang('shareMessage'),
          sharePoster: await fresnsLang('sharePoster'),
          edit: await fresnsLang('edit'),
          delete: await fresnsLang('delete'),
          cancel: await fresnsLang('cancel'),
          modifierCompleted: await fresnsLang('modifierCompleted'),
          contentAuthorLiked: await fresnsLang('contentAuthorLiked'),
        },
        title: nickname + ': ' + content,
        nickname: nickname,
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

    // 评论框高度
    eventCommentBoxHeight: function (e) {
      let height = e.detail.height;

      if (e.detail.height) {
        height = e.detail.height + 50;
      }

      this.setData({
        commentBoxBottom: height,
      });
    },

    // 评论 Dialog 全屏
    eventCommentDialogFullScreen: function (e) {
      const status = e.detail.status;

      this.setData({
        commentDialogFullScreen: status,
      });
    },

    // 评论框隐藏
    eventCommentBoxHide: function () {
      this.setData({
        showCommentBox: false,
      });
    },

    // 显示分享菜单
    onShowShareMenus() {
      this.setData({
        showShareSheet: true,
      });
    },

    // 显示更多菜单
    onShowMoreMenus() {
      this.setData({
        showMoreSheet: true,
      });
    },

    // 隐藏分享和更多菜单
    onHideMenus() {
      this.setData({
        showShareSheet: false,
        showMoreSheet: false,
      });
    },

    // 分享菜单: 复制链接
    onClickCopyShareLink() {
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
        showShareSheet: true,
      });
    },

    // 分享菜单: 多端应用分享给好友
    onClickShareAppMessage() {
      const comment = this.data.comment;
      const title = this.data.title;

      // wx.miniapp.shareMiniProgramMessage
      // wx.miniapp.shareWebPageMessage
      wx.miniapp.shareMiniProgramMessage({
        userName: fresnsClient.mpId,
        path: '/pages/comments/detail?cid=' + comment.cid,
        title: title,
        imagePath: '/assets/images/share.png',
        webpageUrl: comment.url,
        withShareTicket: true,
        miniprogramType: 0,
        scene: 0,
        fail(res) {
          wx.showToast({
            title: '[' + res.errCode + '] ' + res.errMsg,
            icon: 'none',
          });
        },
      });
    },

    // 分享菜单: 生成海报
    onClickSharePoster: async function () {
      const comment = this.data.comment;

      // mixins/fresnsInteraction.js
      callPageFunction('onSharePoster', 'comment', comment.cid);
    },

    // 删除帖子
    onClickDelete() {
      const comment = this.data.comment;

      // mixins/fresnsInteraction.js
      callPageFunction('onDeleteComment', comment.cid);

      this.setData({
        showMoreSheet: false,
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
        comment.likeCount = comment.likeCount ? comment.likeCount + 1 : comment.likeCount; // 计数加一

        if (comment.interaction.dislikeStatus) {
          comment.interaction.dislikeStatus = false; // 取消踩
          comment.dislikeCount = comment.dislikeCount ? comment.dislikeCount - 1 : comment.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.mark({
        markType: 'like',
        type: 'comment',
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
        comment.dislikeCount = comment.dislikeCount ? comment.dislikeCount + 1 : comment.dislikeCount; // 计数加一

        if (comment.interaction.likeStatus) {
          comment.interaction.likeStatus = false; // 取消赞
          comment.likeCount = comment.likeCount ? comment.likeCount - 1 : comment.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.mark({
        markType: 'dislike',
        type: 'comment',
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
        comment.followCount = comment.followCount ? comment.followCount + 1 : comment.followCount; // 计数加一

        if (comment.interaction.blockStatus) {
          comment.interaction.blockStatus = false; // 取消屏蔽
          comment.blockCount = comment.blockCount ? comment.blockCount - 1 : comment.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangeComment', comment);

      const resultRes = await fresnsApi.user.mark({
        markType: 'follow',
        type: 'comment',
        fsid: comment.cid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangeComment', initialComment);
      }

      // 由于「更多」菜单触发后会自动隐藏，所以操作成功后显示消息提示框
      wx.showToast({
        title: resultRes.message,
        icon: 'none',
        duration: 2000,
      });
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

        const resultRes = await fresnsApi.user.mark({
          markType: 'block',
          type: 'comment',
          fsid: comment.cid,
        });

        // 接口请求失败，数据还原
        if (resultRes.code != 0) {
          callPageFunction('onChangeComment', initialComment);
        }

        // 由于「更多」菜单触发后会自动隐藏，所以操作成功后显示消息提示框
        wx.showToast({
          title: resultRes.message,
          icon: 'none',
          duration: 2000,
        });

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
            comment.blockCount = comment.blockCount ? comment.blockCount + 1 : comment.blockCount; // 计数加一

            if (comment.interaction.followStatus) {
              comment.interaction.followStatus = false; // 取消关注
              comment.followCount = comment.followCount ? comment.followCount - 1 : comment.followCount; // 计数减一
            }

            // mixins/fresnsInteraction.js
            callPageFunction('onChangeComment', comment);

            const resultRes = await fresnsApi.user.mark({
              markType: 'block',
              type: 'comment',
              fsid: comment.cid,
            });

            // 接口请求失败，数据还原
            if (resultRes.code != 0) {
              callPageFunction('onChangeComment', initialComment);
            }

            // 由于「更多」菜单触发后会自动隐藏，所以操作成功后显示消息提示框
            wx.showToast({
              title: resultRes.message,
              icon: 'none',
              duration: 2000,
            });
          }
        },
      });
    },
  },
});
