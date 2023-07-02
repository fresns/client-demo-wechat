/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { truncateText } from '../../../utils/fresnsUtilities';

Component({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../../mixins/handler/commentHandler'),
  ],

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
          value: comment.interaction.followStatus ? 'unfollow' : 'follow',
        });
      }

      // 屏蔽
      if (comment.interaction.blockSetting) {
        items.push({
          text: comment.interaction.blockStatus ? '✔ ' + comment.interaction.blockName : comment.interaction.blockName,
          type: 'warn',
          value: comment.interaction.blockStatus ? 'unblock' : 'block',
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
      console.log(e);

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
      console.log(e);

      this.setData({
        showActionSheet: false,
      });
    },
  },
});
