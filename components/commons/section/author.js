/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { globalInfo } from '../../../utils/fresnsGlobalInfo';

Component({
  /** 组件的属性列表 **/
  properties: {
    author: Object,
    isAnonymous: Boolean,
    createdTimeAgo: String,
    location: Object,
  },

  /** 组件的初始数据 **/
  data: {
    userHomePath: '',
    userDeactivate: null,
    authorAnonymous: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        userHomePath: await globalInfo.userHomePath(),
        userDeactivate: await fresnsLang('userDeactivate'),
        authorAnonymous: await fresnsLang('contentAuthorAnonymous'),
      });
    },
  },
});
