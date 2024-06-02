/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsViewProfilePath } from '../../sdk/helpers/profiles';

Component({
  /** 组件的属性列表 **/
  properties: {
    user: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    userProfilePath: '',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const user = this.data.user;

      const userProfilePath = await fresnsViewProfilePath(user.fsid);

      this.setData({
        userProfilePath: userProfilePath,
      });
    },
  },
});
