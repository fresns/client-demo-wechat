/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    show: Boolean,
    config: Object,
  },

  /** 组件的初始数据 **/
  data: {
    showDialog: false,
    title: '提及',

    inputShowed: true,
    inputPlaceholder: '搜索',
    inputCancel: '取消',
    inputVal: '',

    hashtagConfig: {},

    hashtags: [],
    loadingStatus: false,
    loadingTipType: 'none',
  },

  /** 组件数据字段监听器 **/
  observers: {
    'show, config': function (show, config) {
      this.setData({
        showDialog: show,
        hashtagConfig: config,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        title: await fresnsLang('editorHashtag'),
        inputPlaceholder: await fresnsLang('search'),
        inputCancel: await fresnsLang('cancel'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 关闭窗口
    close() {
      this.setData({
        showDialog: false,
      });

      callPageFunction('switchShowHashtagDialog');
    },

    // 显示输入
    showInput() {
      this.setData({
        inputShowed: true,
      });
    },

    // 隐藏输入
    hideInput() {
      this.setData({
        inputVal: '',
        inputShowed: false,
      });
    },

    // 清除输入内容
    clearInput() {
      this.setData({
        inputVal: '',
      });
    },

    // 输入
    inputTyping(e) {
      const value = e.detail.value;

      this.setData({
        inputVal: value,
      });
    },

    // 输入完成
    inputConfirm: async function () {
      await this.loadHashtagList();
    },

    // 选中
    onSelectHashtag: async function (e) {
      const config = this.data.hashtagConfig;
      const name = e.currentTarget.dataset.name;

      let text = '#' + name + ' ';
      if (config.format == 2) {
        text = '#' + name + '#';
      }

      callPageFunction('onContentInsert', text);
      this.triggerEvent('eventContentInsert', {
        data: text,
      });

      this.setData({
        showDialog: false,
      });
    },

    // 加载话题列表
    loadHashtagList: async function () {
      const searchKey = this.data.inputVal;
      if (!searchKey) {
        return;
      }

      wx.showNavigationBarLoading();

      this.setData({
        loadingStatus: true,
      });

      const resultRes = await fresnsApi.common.commonInputTips({
        type: 'hashtag',
        key: searchKey,
      });

      if (resultRes.code === 0) {
        let tipType = 'none';
        if (!resultRes.data) {
          tipType = 'empty';
        }

        this.setData({
          hashtags: resultRes.data,
          loadingTipType: tipType,
        });
      }

      this.setData({
        loadingStatus: false,
      });

      wx.hideNavigationBarLoading();
    },
  },
});
