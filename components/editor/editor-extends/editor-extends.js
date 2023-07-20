/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    extends: Object,
  },

  /** 组件的初始数据 **/
  data: {
    fresnsLang: {},
    showActionSheet: false,
    actionGroups: [],
    deleteType: null,
    deleteEid: null,
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        fresnsLang: await fresnsLang(),
        actionGroups: [
          {
            text: await fresnsLang('delete'),
            type: 'warn',
            value: 'delete',
          },
        ],
      });
    },
  },

  /** 组件功能 **/
  methods: {
    onMenu: function (e) {
      const type = e.currentTarget.dataset.type;
      const eid = e.currentTarget.dataset.eid;

      this.setData({
        showActionSheet: true,
        deleteType: type,
        deleteEid: eid,
      });
    },

    clickMenu: function (e) {
      const value = e.detail.value;

      if (value == 'delete') {
        callPageFunction('onDeleteExtend', this.data.deleteType, this.data.deleteEid);
      }

      this.setData({
        showActionSheet: false,
      });
    },
  },
});
