/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    post: Object,
  },

  /** 组件的初始数据 **/
  data: {
    newContent: null,
  },

  /** 组件数据字段监听器 **/
  observers: {
    post: async function (post) {
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

      const newContent = nickname + ': ' + post.content;

      this.setData({
        newContent: newContent,
      });
    },
  },
});
