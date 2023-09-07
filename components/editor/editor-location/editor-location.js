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
    location: {
      type: Object,
      value: null,
    },
    config: Object,
  },

  /** 组件的初始数据 **/
  data: {
    addLocation: '添加位置',
    mapUrl: null,
    showActionSheet: false,
    actionGroups: [],
    poi: '',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      this.setData({
        actionGroups: [
          {
            text: await fresnsLang('reselect'),
            value: 'reselect',
          },
          {
            text: await fresnsLang('delete'),
            type: 'warn',
            value: 'delete',
          },
        ],
        addLocation: await fresnsLang('editorLocation'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 选择位置
    onClickSelectLocation: function () {
      const location = this.data.location;

      wx.chooseLocation({
        latitude: location?.latitude,
        longitude: location?.longitude,
        success(res) {
          const mapJson = {
            mapId: 5,
            latitude: res.latitude,
            longitude: res.longitude,
            scale: null,
            continent: null,
            continentCode: null,
            country: null,
            countryCode: null,
            region: null,
            regionCode: null,
            city: null,
            cityCode: null,
            district: null,
            address: res.address,
            zip: null,
            poi: res.name,
            poiId: null,
          };

          callPageFunction('onLocationChange', mapJson);
        },
      });
    },

    // 位置操作
    onClickReselect(e) {
      this.setData({
        showActionSheet: true,
      });
    },

    // 菜单操作
    onReselectLocation(e) {
      const action = e.detail.value;

      // 重选
      if (action == 'reselect') {
        this.onClickSelectLocation();
      }

      // 删除
      if (action == 'delete') {
        callPageFunction('onLocationDelete');
      }

      this.setData({
        showActionSheet: false,
      });
    },
  },
});
