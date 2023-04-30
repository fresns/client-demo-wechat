/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
Component({
  /** 组件的属性列表 **/
  properties: {
    files: Object,
    fileCount: Object,
  },

  /** 组件的初始数据 **/
  data: {
    imageUrls: [],
  },

  /** 组件功能 **/
  methods: {
    // 预览
    previewImages(e) {
      wx.previewImage({
        current: e.target.dataset.url,
        urls: this.data.imageUrls,
      })
    },

    // 下载
    downloadFile(e) {
      wx.showToast({
        title: '小程序内不支持下载，请前往网站或 App 操作',
        icon: "none",
      });
    },

    // 文件事件
    handleFileTap(e) {
      console.log(e);
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const files = this.data.files;

      if (files && files.images) {
        const images = files.images;
        const urls = images.map(image => image.imageBigUrl);

        this.setData({
          imageUrls: urls,
        })
      }
    }
  }
})