/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services/api';
import { fresnsLang, fresnsEditor } from '../../../helpers/configs';

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
    title: {
      type: String,
      value: '',
    },
  },

  /** 组件的初始数据 **/
  data: {
    placeholder: null,
    config: {},
    updateValue: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const langEditorTitle = await fresnsLang('editorTitle');
      const langRequired = await fresnsLang('required');
      const langOptional = await fresnsLang('optional');

      const type = this.data.type;
      const config = await fresnsEditor[type]('editor.title');

      let placeholder = langEditorTitle + ' (' + langOptional + ')';
      if (config.required) {
        placeholder = langEditorTitle + ' (' + langRequired + ')';
      }

      this.setData({
        placeholder: placeholder,
        config: config,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 更新标题
    // [输入框失去焦点时触发]
    // [点击完成按钮时触发]
    onUpdate: async function (e) {
      const value = e.detail.value;
      const cleanedValue = value.replace(/\n/g, '');
      const title = this.data.title;

      if (title == cleanedValue) {
        return;
      }

      this.setData({
        title: cleanedValue,
      });

      const type = this.data.type;
      const did = this.data.did;

      await fresnsApi.editor.draftUpdate(type, did, { title: cleanedValue });
    },
  },
});
