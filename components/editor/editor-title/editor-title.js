/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang, fresnsCodeMessage } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsCallback';

Component({
  /** 组件的属性列表 **/
  properties: {
    value: {
      type: String,
      value: null,
    },
    config: Object,
  },

  /** 组件的初始数据 **/
  data: {
    title: '',
    titleConfig: {},
    langEditorTitle: '',
    langEditorRequired: '',
    langEditorOptional: '',
  },

  /** 组件数据字段监听器 **/
  observers: {
    'value, config': function (value, config) {
      this.setData({
        title: value,
        titleConfig: config,
      })
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        langEditorTitle: await fresnsLang('editorTitle'),
        langEditorRequired: await fresnsLang('editorRequired'),
        langEditorOptional: await fresnsLang('editorOptional'),
      })
    }
  },

  /** 组件功能 **/
  methods: {
    // 键盘输入时触发
    onInput: function (e) {
      const { value } = e.detail

      this.setData({
        title: value,
      })

      callPageFunction('onTitleChange', value)
    },

    // 点击完成按钮时触发
    onConfirm: async function (e) {
      const { value } = e.detail

      this.setData({
        title: value,
      })

      const config = this.data.config
      if (value.length > config.length) {
        wx.showToast({
          title: await fresnsCodeMessage(38203),
          icon: 'none',
          duration: 3000,
        });

        return
      }

      callPageFunction('onTitleSubmit', value)
    },
  },
})
