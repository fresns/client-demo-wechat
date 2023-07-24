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
    post: Object,
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
      commentActive:'/assets/interaction/content-comment.png',
      share: '/assets/interaction/content-share.png',
      shareActive: '/assets/interaction/content-share.png',
      more: '/assets/interaction/content-more.png',
      moreActive: '/assets/interaction/content-more.png',
    }
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
    post: async function (post) {
      if (!post) {
        return;
      }

      const userDeactivate = await fresnsLang('userDeactivate');
      const authorAnonymous = await fresnsLang('contentAuthorAnonymous');
      const fsEdit = await fresnsLang('edit');
      const fsDelete = await fresnsLang('delete');

      let postTitle = post.title || truncateText(post.content, 20);
      let nickname = post.author.nickname;

      if (!post.author.status) {
        nickname = userDeactivate;
      } else if (post.isAnonymous) {
        nickname = authorAnonymous;
      }

      let items = [];

      // 编辑
      if (post.editControls.isMe && post.editControls.canEdit) {
        items.push({
          text: fsEdit,
          type: 'default',
          value: 'edit',
        });
      }

      // 删除
      if (post.editControls.isMe && post.editControls.canDelete) {
        items.push({
          text: fsDelete,
          type: 'warn',
          value: 'delete',
        });
      }

      // 关注
      if (post.interaction.followSetting) {
        items.push({
          text: post.interaction.followStatus ? '✔ ' + post.interaction.followName : post.interaction.followName,
          type: 'default',
          value: 'follow',
        });
      }

      // 屏蔽
      if (post.interaction.blockSetting) {
        items.push({
          text: post.interaction.blockStatus ? '✔ ' + post.interaction.blockName : post.interaction.blockName,
          type: 'warn',
          value: 'block',
        });
      }

      // 管理扩展
      if (post.manages && post.manages.length > 0) {
        for (let i = 0; i < post.manages.length; i++) {
          const plugin = post.manages[i];
          items.push({
            text: plugin.name,
            type: 'default',
            value: plugin.url,
          });
        }
      }

      this.setData({
        title: nickname + ': ' + postTitle,
        nickname: nickname,
        actionGroups: items,
      });

      // buttonIcons
      const checkButtonIcons = post.operations && post.operations.buttonIcons;
      if (checkButtonIcons) {
        const ButtonIconsArr = post.operations.buttonIcons;
        const likeItem = ButtonIconsArr.find(item => item.code === 'like');
        const dislikeItem = ButtonIconsArr.find(item => item.code === 'dislike');
        const followItem = ButtonIconsArr.find(item => item.code === 'follow');
        const blockItem = ButtonIconsArr.find(item => item.code === 'block');
        const commentItem = ButtonIconsArr.find(item => item.code === 'comment');
        const shareItem = ButtonIconsArr.find(item => item.code === 'share');
        const moreItem = ButtonIconsArr.find(item => item.code === 'more');

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
        }

        this.setData({
          buttonIcons: buttonIcons,
        });
      }
    },
  },

  /** 组件功能 **/
  methods: {
    // 评论框显示
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
      const post = this.data.post;
      const copySuccess = this.data.fresnsLang.copySuccess;

      wx.setClipboardData({
        data: post.url,
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
      const post = this.data.post;

      // 编辑
      if (value === 'edit') {
        wx.navigateTo({
          url: '/pages/editor/index?type=post&fsid=' + post.pid,
        });

        this.setData({
          showActionSheet: false,
        });
      }

      // 删除
      if (value === 'delete') {
        // mixins/fresnsInteraction.js
        callPageFunction('onDeletePost', post.pid);

        this.setData({
          showActionSheet: false,
        });
      }

      // 关注
      if (value === 'follow') {
        this.onClickPostFollow();
      }

      // 屏蔽
      if (value === 'block') {
        this.onClickPostBlock();
      }

      // 扩展插件
      if (value.startsWith('http')) {
        const fresnsExtensions = {
          type: 'post',
          scene: 'manage',
          postMessageKey: 'fresnsPostManage',
          pid: post.pid,
          uid: post.author.uid,
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
    onClickPostLike: async function () {
      const post = this.data.post;
      const initialPost = JSON.parse(JSON.stringify(this.data.post)); // 拷贝一个小组初始数据

      if (post.interaction.likeStatus) {
        post.interaction.likeStatus = false; // 取消赞
        post.likeCount = post.likeCount ? post.likeCount - 1 : post.likeCount; // 计数减一
      } else {
        post.interaction.likeStatus = true; // 赞
        post.likeCount = post.likeCount + 1; // 计数加一

        if (post.interaction.dislikeStatus) {
          post.interaction.dislikeStatus = false; // 取消踩
          post.dislikeCount = post.dislikeCount ? post.dislikeCount - 1 : post.dislikeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangePost', post);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'like',
        markType: 'post',
        fsid: post.pid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangePost', initialPost);
      }
    },

    // 踩
    onClickPostDislike: async function () {
      const post = this.data.post;
      const initialPost = JSON.parse(JSON.stringify(this.data.post)); // 拷贝一个小组初始数据

      if (post.interaction.dislikeStatus) {
        post.interaction.dislikeStatus = false; // 取消踩
        post.dislikeCount = post.dislikeCount ? post.dislikeCount - 1 : post.dislikeCount; // 计数减一
      } else {
        post.interaction.dislikeStatus = true; // 踩
        post.dislikeCount = post.dislikeCount + 1; // 计数加一

        if (post.interaction.likeStatus) {
          post.interaction.likeStatus = false; // 取消赞
          post.likeCount = post.likeCount ? post.likeCount - 1 : post.likeCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangePost', post);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'dislike',
        markType: 'post',
        fsid: post.pid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangePost', initialPost);
      }
    },

    // 关注
    onClickPostFollow: async function () {
      const post = this.data.post;
      const initialPost = JSON.parse(JSON.stringify(this.data.post)); // 拷贝一个小组初始数据

      if (post.interaction.followStatus) {
        post.interaction.followStatus = false; // 取消关注
        post.followCount = post.followCount ? post.followCount - 1 : post.followCount; // 计数减一
      } else {
        post.interaction.followStatus = true; // 关注
        post.followCount = post.followCount + 1; // 计数加一

        if (post.interaction.blockStatus) {
          post.interaction.blockStatus = false; // 取消屏蔽
          post.blockCount = post.blockCount ? post.blockCount - 1 : post.blockCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangePost', post);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'follow',
        markType: 'post',
        fsid: post.pid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangePost', initialPost);
      }
    },

    // 屏蔽
    onClickPostBlock: async function () {
      const post = this.data.post;
      const initialPost = JSON.parse(JSON.stringify(this.data.post)); // 拷贝一个小组初始数据

      if (post.interaction.blockStatus) {
        post.interaction.blockStatus = false; // 取消屏蔽
        post.blockCount = post.blockCount ? post.blockCount - 1 : post.blockCount; // 计数减一
      } else {
        post.interaction.blockStatus = true; // 屏蔽
        post.blockCount = post.blockCount + 1; // 计数加一

        if (post.interaction.followStatus) {
          post.interaction.followStatus = false; // 取消关注
          post.followCount = post.followCount ? post.followCount - 1 : post.followCount; // 计数减一
        }
      }

      // mixins/fresnsInteraction.js
      callPageFunction('onChangePost', post);

      const resultRes = await fresnsApi.user.userMark({
        interactionType: 'block',
        markType: 'post',
        fsid: post.pid,
      });

      // 接口请求失败，数据还原
      if (resultRes.code != 0) {
        callPageFunction('onChangePost', initialPost);
      }
    },
  },
});
