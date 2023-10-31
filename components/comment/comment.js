/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../api/tool/function';
import { globalInfo } from '../../utils/fresnsGlobalInfo';

Component({
  /** 组件的属性列表 **/
  properties: {
    type: String,
    comment: Object,
  },

  /** 组件的初始数据 **/
  data: {
    commentContent: null,
    contentAuthor: '',
    userHomePath: '',
    userDeactivate: null,
    authorAnonymous: null,
  },

  /** 组件数据字段监听器 **/
  observers: {
    comment: async function (comment) {
      if (!comment) {
        return;
      }

      let newContent = comment.content;

      if (newContent) {
        // 匹配话题
        newContent = newContent.replace(
          /<a\s+href="(?:[^"]*\/)?([^"]+)"\s+class="fresns_hashtag"\s+target="_blank">([\s\S]*?)<\/a>/gi,
          '<a href="/pages/hashtags/detail?hid=$1">$2</a>'
        );

        // 匹配艾特
        newContent = newContent.replace(
          /<a\s+href="(?:[^"]*\/)?([^"]+)"\s+class="fresns_mention"\s+target="_blank">@([\s\S]*?)<\/a>/gi,
          '<a href="/pages/profile/posts?fsid=$1">@$2</a>'
        );

        // 替换用户默认首页
        const userHomePath = await globalInfo.userHomePath();
        newContent = newContent.replace('/pages/profile/posts?fsid=', userHomePath);

        // 增加表情图样式
        newContent = newContent.replace(
          /<img\s+src="([^"]+)"\s+class="fresns_sticker"\s+alt="([\s\S]*?)"\s*\/?>/gi,
          '<img src="$1" style="zoom: 0.5" alt="$2"/>'
        );
      }

      this.setData({
        commentContent: newContent,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        userHomePath: await globalInfo.userHomePath(),
        contentAuthor: await fresnsLang('contentAuthor'),
        userDeactivate: await fresnsLang('userDeactivate'),
        authorAnonymous: await fresnsLang('contentAuthorAnonymous'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 进入详情页
    onClickToDetail(e) {
      if (this.data.type == 'detail') {
        return;
      }

      wx.navigateTo({
        url: '/pages/comments/detail?cid=' + this.data.comment.cid,
      });
    },

    // 用户点击链接
    onClickContentLink(e) {
      const link = e.detail.href;

      // code
    },

    // 发表评论事件
    triggerComment: function () {
      this.selectComponent('#interactionComponent').onClickCreateComment();
    },
  },
});
