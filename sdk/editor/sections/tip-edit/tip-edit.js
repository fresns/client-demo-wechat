/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    editInfo: {
      type: Object,
      value: {},
    },
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsLang: await fresnsLang(),
      });
    },
  },
});
