/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsConfig, fresnsLang, fresnsEditor } from '../../../helpers/configs';

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
  },

  /** 组件的初始数据 **/
  data: {
    dialog: false,
    wrap: false,
    title: null,
    placeholder: null,
    barWords: null,
    cancel: null,
    format: 1,

    inputShowed: false,
    inputVal: '',
    isFocus: false,

    hashtags: [],
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const format = await fresnsEditor.post('editor.hashtag.format');

      this.setData({
        dialog: true,
        wrap: true,
        inputShowed: true,

        title: await fresnsLang('editorHashtag'),
        placeholder: await fresnsLang('search'),
        barWords: await fresnsConfig('hashtag_name'),
        cancel: await fresnsLang('cancel'),

        format: format,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    close() {
      this.triggerEvent('eventDialogShow', { type: 'hashtag' });

      this.setData({
        dialog: false,
        wrap: false,
      });
    },

    // 触发搜索
    showInput() {
      this.setData({
        inputShowed: true,
      });
    },

    // 隐藏搜索
    hideInput() {
      this.setData({
        inputShowed: false,
        inputVal: '',
        hashtags: [],
      });
    },

    // 输入框失去焦点时触发
    blurInput() {
      this.setData({
        isFocus: false,
      });
    },

    // 清除
    clearInput() {
      this.setData({
        inputVal: '',
        hashtags: [],
      });
    },

    // 键盘输入时触发
    inputTyping(e) {
      this.setData({
        inputVal: e.detail.value,
        isFocus: true,
      });
    },

    // 点击完成按钮（搜索）
    inputConfirm: async function (e) {
      const resultRes = await fresnsApi.common.inputTips({
        type: 'hashtag',
        key: e.detail.value,
      });

      if (resultRes.code != 0) {
        return;
      }

      this.setData({
        hashtags: resultRes.data,
      });
    },

    // 选择话题
    onSelectHashtag(e) {
      const format = this.data.format;
      const name = e.currentTarget.dataset.name;

      if (!name) {
        return;
      }

      let text = '#' + name + ' ';
      if (format == 2) {
        text = '#' + name + '#';
      }

      this.triggerEvent('eventInsertContent', { value: text });
      this.close();
    }
  },
});
