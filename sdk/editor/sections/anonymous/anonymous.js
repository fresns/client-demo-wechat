/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsLang } from '../../../helpers/configs';

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
    isAnonymous: {
      type: Boolean,
      value: false,
    },
  },

  /** 组件的初始数据 **/
  data: {
    isEnableAnonymous: false,
    anonymousText: '是否匿名',
  },

  /** 组件数据字段监听器 **/
  observers: {
    isAnonymous: async function (isAnonymous) {
      this.setData({
        isEnableAnonymous: !!isAnonymous,
        anonymousText: await fresnsLang('editorAnonymous'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    bindSwitchAnonymous: async function (e) {
      const value = e.detail.value;
      const isAnonymous = value.length > 0;

      const draftType = this.data.type;
      const did = this.data.did;

      const resultRes = await fresnsApi.editor.draftUpdate(draftType, did, { isAnonymous: isAnonymous });

      if (resultRes.code == 0) {
        this.setData({
          isEnableAnonymous: isAnonymous,
        });
      }
    },
  },
});
