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
    require('../../../mixins/handler/postHandler'),
  ],

  /** 组件的属性列表 **/
  properties: {
    type: String,
    post: Object,
  },

  /** 组件的初始数据 **/
  data: {
    title: null,
    postUrl: null,
    postPage: null,

    showCommentBox: false,
    nickname: null,

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
    post: async function (post) {
      if (!post) {
        return;
      }

      const creatorDeactivate = await fresnsLang('contentCreatorDeactivate');
      const creatorAnonymous = await fresnsLang('contentCreatorAnonymous');
      const fsEdit = await fresnsLang('edit');
      const fsDelete = await fresnsLang('delete');

      let postTitle = post.title || truncateText(post.content, 20);
      let nickname = post.creator.nickname;

      if (! post.creator.status) {
        nickname = creatorDeactivate;
      } else if (post.isAnonymous) {
        nickname = creatorAnonymous;
      };

      let items = [];

      // 编辑
      if (post.editStatus.isMe && post.editStatus.canEdit) {
        items.push({
          text: fsEdit,
          type: 'default',
          value: 'edit',
        });
      }

      // 删除
      if (post.editStatus.isMe && post.editStatus.canDelete) {
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
          value: post.interaction.followStatus ? 'unfollow' : 'follow',
        });
      }

      // 屏蔽
      if (post.interaction.blockSetting) {
        items.push({
          text: post.interaction.blockStatus ? '✔ ' + post.interaction.blockName : post.interaction.blockName,
          type: 'warn',
          value: post.interaction.blockStatus ? 'unblock' : 'block',
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
        actionGroups: items,
        postUrl: post.url,
        postPage: 'pages/posts/detail?pid=' + post.pid,
      })
    },
  },

  /** 组件功能 **/
  methods: {
    // 评论
    onClickCreateComment() {
      this.setData({
        showCommentBox: true
      })
    },

    // 分享
    onClickShare() {
      this.setData({
        showShareActionSheet: true
      })
    },
    actionClickShare(e) {
      console.log(e)

      // 复制链接
      if (e.detail.value === 'onShareCopyLink') {
        wx.setClipboardData({
          data: this.data.postUrl,
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            });
          }
        })
      }

      // 分享给好友
      if (e.detail.value === 'onShareAppMessage') {
        // this.data.postPage
      }

      // 分享到朋友圈
      if (e.detail.value === 'onShareTimeline') {
        // this.data.postPage
      }

      this.setData({
        showShareActionSheet: false
      })
    },

    // 更多菜单
    onClickContentMore() {
      this.setData({
        showActionSheet: true
      })
    },
    actionClickMore(e) {
      console.log(e)

      this.setData({
        showActionSheet: false
      })
    }
  },
})