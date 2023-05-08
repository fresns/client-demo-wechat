/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsCallback';

Component({
  /** 组件的属性列表 **/
  properties: {
    content: {
      type: String,
      value: '',
    },
    contentLength: Number,
    mentionConfig: Object,
    hashtagConfig: Object,
  },

  /** 组件的初始数据 **/
  data: {
    placeholder: '',
    contentLengthConfig: 0,
    draftContentLength: 0,
    toolMentionConfig: {},
    toolHashtagConfig: {},
  },

  /** 组件数据字段监听器 **/
  observers: {
    'contentLength, mentionConfig, hashtagConfig': function (contentLength, mentionConfig, hashtagConfig) {
      this.setData({
        contentLengthConfig: contentLength,
        toolMentionConfig: mentionConfig,
        toolHashtagConfig: hashtagConfig,
      });
    },

    content: function (content) {
      if (!content) {
        return;
      }

      this.setData({
        draftContentLength: content.replaceAll('\n', '').length,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        placeholder: await fresnsLang('editorContent'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 输入框聚焦时触发
    handleFocus: function (e) {
      callPageFunction('onToolbarBottom', e.detail.height);
    },

    // 键盘输入时触发
    handleInput: function (e) {
      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;
      const { toolMentionConfig, toolHashtagConfig } = this.data;

      this.setData({
        draftContentLength: value.replaceAll('\n', '').length,
      });

      callPageFunction('onContentChange', value);
      callPageFunction('onContentCursor', cursorPosition);

      const prevCharacter = value.charAt(cursorPosition - 1);
      if (toolMentionConfig.status && prevCharacter === '@') {
        callPageFunction('switchShowMentionDialog');
      }
      if (toolHashtagConfig.status && prevCharacter === '#') {
        callPageFunction('switchShowHashtagDialog');
      }
    },

    // 点击完成按钮时触发
    handleConfirm: function (e) {
      const value = e.detail.value;

      this.setData({
        draftContentLength: value.replaceAll('\n', '').length,
      });

      callPageFunction('onContentSubmit', value);
    },

    // 键盘高度发生变化的时候触发
    handleKeyboard: function (e) {
      callPageFunction('onToolbarBottom', e.detail.height);
    },

    // 输入框失去焦点时触发
    handleBlur: function (e) {
      const cursorPosition = e.detail.cursor;

      callPageFunction('onContentCursor', cursorPosition);
    },
  },
});
