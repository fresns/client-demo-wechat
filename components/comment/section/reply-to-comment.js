/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';

Component({
  /** 组件的属性列表 **/
  properties: {
    comment: Object,
  },

  /** 组件的初始数据 **/
  data: {
    publishCommentName: null,
    userDeactivate: null,
    authorAnonymous: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        publishCommentName: await fresnsConfig('publish_comment_name'),
        userDeactivate: await fresnsLang('userDeactivate'),
        authorAnonymous: await fresnsLang('contentAuthorAnonymous'),
      });
    },
  },
});
