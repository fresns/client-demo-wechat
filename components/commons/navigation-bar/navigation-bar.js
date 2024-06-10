/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
Component({
  /** 组件的配置选项 **/
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  /** 组件的属性列表 **/
  properties: {
    title: {
      type: String,
      value: '',
    },
    backButton: {
      type: Boolean,
      value: true,
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    customRoute: {
      type: Boolean,
      value: false,
    },
  },

  /** 组件的初始数据 **/
  data: {},

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached() {},
  },

  /** 组件功能 **/
  methods: {
    goBack() {
      wx.navigateBack({
        delta: 1,
        fail() {
          wx.reLaunch({
            url: '/pages/posts/index',
          });
        },
      });
    },

    goHome() {
      wx.reLaunch({
        url: '/pages/posts/index',
      });
    },
  },
});
