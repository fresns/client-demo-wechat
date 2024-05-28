/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../sdk/helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    post: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    newContent: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const post = this.data.post;

      if (!post) {
        return;
      }

      let nickname = post.author.nickname;
      if (!post.author.status) {
        nickname = await fresnsLang('userDeactivate');
      }
      if (post.isAnonymous) {
        nickname = await fresnsLang('contentAuthorAnonymous');
      }

      const summaries = post.title || post.contentLength > 26 ? post.content.slice(0, 26) + '...' : post.content;

      const newContent = nickname + ': ' + summaries;

      this.setData({
        newContent: newContent,
      });
    },
  },
});
