/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
Component({
  /** 组件的属性列表 **/
  properties: {
    type: {
      type: String,
      value: 'post',
    },
    fsid: {
      type: String,
      value: null,
    },
    infos: {
      type: Array,
      value: [],
    },
  },

  /** 组件的初始数据 **/
  data: {
    pid: '',
    cid: '',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const type = this.data.type;
      const fsid = this.data.fsid;

      this.setData({
        pid: type == 'post' ? fsid : '',
        cid: type == 'comment' ? fsid : '',
      });
    },
  },
});
