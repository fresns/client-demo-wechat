/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
Component({
  /** 组件的属性列表 **/
  properties: {
    file: Object,
  },

  /** 组件的初始数据 **/
  data: {},

  /** 组件功能 **/
  methods: {
    // 预览
    previewImage(e) {
      const url = e.target.dataset.url;

      wx.previewImage({
        urls: [url],
      });
    },

    // 下载
    downloadFile(e) {
      wx.showToast({
        title: '小程序内不支持下载，请前往网站或 App 操作',
        icon: 'none',
      });
    },

    // 文件事件
    handleFileTap(e) {
      console.log(e);
    },
  },
});
