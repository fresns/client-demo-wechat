/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';
import { globalInfo } from '../../../utils/fresnsGlobalInfo';

Component({
  /** 组件的属性列表 **/
  properties: {
    author: Object,
    isAnonymous: Boolean,
    createdTimeAgo: String,
    location: Object,
    ipLocation: String,
    ipLocationShow: {
      type: Boolean,
      value: true,
    },
  },

  /** 组件的初始数据 **/
  data: {
    userHomePath: '',
    userDeactivate: null,
    authorAnonymous: null,
    ipLocationStatus: false,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        userHomePath: await globalInfo.userHomePath(),
        userDeactivate: await fresnsLang('userDeactivate'),
        authorAnonymous: await fresnsLang('contentAuthorAnonymous'),
        ipLocationStatus: await fresnsConfig('account_ip_location_status'),
        ipLocationDesc: await fresnsLang('ipLocation'),
        errorIp: await fresnsLang('errorIp'),
      });
    },
  },
});
