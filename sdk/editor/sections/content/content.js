/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
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
    content: {
      type: String,
      value: '',
    },
  },

  /** 组件的初始数据 **/
  data: {
    placeholder: '',
    config: {},
    autoHeight: false,

    cursorPosition: 0,
    currentContentLength: 0,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const content = this.data.content;

      const type = this.data.type;
      const config = await fresnsEditor[type]('editor');
      const length = content.replaceAll('\n', '').length;

      this.setData({
        placeholder: await fresnsLang('editorContent'),
        config: config,
        cursorPosition: length,
        currentContentLength: length,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 键盘输入时触发
    handleInput: function (e) {
      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;
      const config = this.data.config;

      this.setData({
        cursorPosition: cursorPosition,
        currentContentLength: value.replaceAll('\n', '').length,
      });

      const prevCharacter = value.charAt(cursorPosition - 1);

      if (config.mention.status && prevCharacter === '@') {
        this.triggerEvent('eventDialogShow', { type: 'mention' });
      }
      if (config.hashtag.status && prevCharacter === '#') {
        this.triggerEvent('eventDialogShow', { type: 'hashtag' });
      }
    },

    // 输入框行数变化时
    handleLineChange: function (e) {
      const height = e.detail.height;
      const heightRpx = e.detail.heightRpx;
      const lineCount = e.detail.lineCount;

      if (lineCount > 11) {
        this.setData({
          autoHeight: true,
        });
      }
    },

    // 更新内容
    // [输入框失去焦点时触发]
    // [点击完成按钮时触发]
    onUpdate: async function (e) {
      const value = e.detail.value;
      const cursorPosition = e.detail.cursor;
      const content = this.data.content;

      if (typeof cursorPosition === 'number' && cursorPosition >= 0) {
        console.log('onUpdate', 'cursorPosition', cursorPosition);
        this.setData({
          cursorPosition: cursorPosition,
        });
      }

      if (content == value) {
        return;
      }

      this.setData({
        content: value,
        currentContentLength: value.replaceAll('\n', '').length,
      });

      const type = this.data.type;
      const did = this.data.did;

      await fresnsApi.editor.draftUpdate(type, did, { content: value });
    },

    // 插入内容
    onInsertContent: function(text) {
      const content = this.data.content || '';
      const cursorPosition = this.data.cursorPosition;

      const prevCharacter = content.charAt(cursorPosition - 1);
      const firstCharacterOfText = text.charAt(0);

      let newText = text;
      if (prevCharacter === firstCharacterOfText) {
        newText = text.slice(1);
      }

      const newContent = content.slice(0, cursorPosition) + newText + content.slice(cursorPosition);

      this.setData({
        content: newContent,
        cursorPosition: cursorPosition + text.length,
      });
    },
  },
});
