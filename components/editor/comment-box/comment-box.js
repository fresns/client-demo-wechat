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
    pid: String,
    cid: {
      type: String,
      value: ''
    },
  },

  /** 组件的初始数据 **/
  data: {
    fresnsConfig: {},
    fsLang: {},
    userLogin: false,
    isEnableAnonymous: false,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsConfig: await fresnsConfig(),
        fsLang: {
          accountLogin: await fresnsLang('accountLogin'),
          content: await fresnsLang('editorContent'),
          anonymous: await fresnsLang('editorAnonymous'),
        },
        userLogin: globalInfo.userLogin,
      })
    }
  },

  /** 组件功能 **/
  methods: {},
})
