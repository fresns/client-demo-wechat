/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../sdk/helpers/configs';
import { fresnsViewProfilePath } from '../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    viewType: {
      type: String,
      value: 'list', // list or detail
    },
    showReplyToPost: {
      type: Boolean,
      value: true,
    },
    comment: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    commentContent: null,
    contentAuthor: '',
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
          '<a href="/pages/hashtags/detail?htid=$1">$2</a>'
        );

        // 匹配艾特
        newContent = newContent.replace(
          /<a\s+href="(?:[^"]*\/)?([^"]+)"\s+class="fresns_mention"\s+target="_blank">@([\s\S]*?)<\/a>/gi,
          '<a href="/pages/profile/posts?fsid=$1">@$2</a>'
        );

        // 替换用户默认首页
        const userProfilePath = await fresnsViewProfilePath();
        newContent = newContent.replace('/pages/profile/posts?fsid=', userProfilePath);

        // 增加表情图样式
        newContent = newContent.replace(
          /<img\s+src="([^"]+)"\s+class="fresns_sticker"\s+alt="([\s\S]*?)"\s*\/?>/gi,
          '<img src="$1" alt="$2" class="fresns_sticker" style="display:inline-block;transform:scale(0.5);transform-origin:0 0;width:auto;height:auto;vertical-align:middle;"/>'
        );
        // 表情图尺寸推荐使用 style="zoom:0.5" 缩小一半尺寸，但是 Skyline 不支持该样式
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
      if (this.data.viewType == 'detail') {
        return;
      }

      wx.navigateTo({
        url: '/pages/comments/detail?cid=' + this.data.comment.cid,
      });
    },
  },
});
