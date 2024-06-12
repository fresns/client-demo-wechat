/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../helpers/configs';

Component({
  /** 组件的属性列表 **/
  properties: {
    status: {
      type: Boolean,
      value: true,
    },
    tipType: {
      type: String,
      value: 'none', // none, page, empty
    },
  },

  /** 组件的初始数据 **/
  data: {
    loading: '正在加载',
    tipStatus: false,
    tipText: '',
  },

  /** 组件数据字段监听器 **/
  observers: {
    tipType: async function (tipType) {
      if (tipType == 'none') {
        this.setData({
          tipStatus: false,
        });
      }

      if (tipType == 'page') {
        const listWithoutPage = await fresnsLang('listWithoutPage', '没有了');
        this.setData({
          tipStatus: true,
          tipText: listWithoutPage,
        });
      }

      if (tipType == 'empty') {
        const listEmpty = await fresnsLang('listEmpty', '列表为空，暂无内容');
        this.setData({
          tipStatus: true,
          tipText: listEmpty,
        });
      }
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const loading = await fresnsLang('loading', '正在加载');

      this.setData({
        loading: loading,
      });
    },
  },
});
