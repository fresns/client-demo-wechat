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
    did: {
      type: String,
      value: null,
    },
    infos: {
      type: Array,
      value: [],
    },
  },

  /** 组件功能 **/
  methods: {
    handleExtensionTap: function (e) {
      const navigatorData = e.currentTarget.dataset;

      console.log('handleExtensionTap navigatorData', navigatorData);

      const app = getApp();
      app.globalData.navigatorData = navigatorData;
    },
  },
});
