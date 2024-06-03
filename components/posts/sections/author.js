/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../sdk/helpers/configs';
import { fresnsViewProfilePath } from '../../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    author: {
      type: Object,
      value: null,
    },
    isAnonymous: {
      type: Boolean,
      value: false,
    },
    createdTimeAgo: {
      type: String,
      value: null,
    },
    geotag: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    userProfilePath: '',
    userDeactivate: null,
    authorAnonymous: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const author = this.data.author;

      this.setData({
        userProfilePath: await fresnsViewProfilePath(author.fsid),
        userDeactivate: await fresnsLang('userDeactivate'),
        authorAnonymous: await fresnsLang('contentAuthorAnonymous'),
      });
    },
  },
});
