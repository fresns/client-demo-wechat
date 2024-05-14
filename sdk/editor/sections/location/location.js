/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsConfig, fresnsLang } from '../../../helpers/configs';

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
    locationInfo: {
      type: Object,
      value: null,
    },
    geotag: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    name: null,
    selectLocation: '添加位置',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const locationInfo = this.data.locationInfo;
      const geotag = this.data.geotag;

      let name = locationInfo?.name;
      if (geotag) {
        name = geotag.name;
      }

      this.setData({
        name: name,
        selectLocation: await fresnsLang('editorLocation'),
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 选择位置
    onClickSelectLocation: function () {
      const name = this.data.name;

      if (name) {
        this.onActionSheet();
        return;
      }

      this.onChooseLocation();
    },

    // 位置菜单
    onActionSheet: async function () {
      const draftType = this.data.type;
      const did = this.data.did;

      const itemList = [await fresnsLang('reselect'), await fresnsLang('delete')];

      wx.showActionSheet({
        itemList: itemList,
        success: async (res) => {
          const tapIndex = res.tapIndex;

          if (tapIndex == 0) {
            this.onChooseLocation();

            return;
          }

          const resultRes = await fresnsApi.editor.draftUpdate(draftType, did, { deleteLocation: true });

          if (resultRes.code == 0) {
            this.setData({
              name: null,
            });
          }
        },
      });
    },

    // 选择位置
    onChooseLocation: async function () {
      const locationInfo = this.data.locationInfo;
      const geotag = this.data.geotag;

      let latitude = locationInfo?.latitude;
      let longitude = locationInfo?.longitude;

      if (geotag) {
        latitude = geotag.latitude;
        longitude = geotag.longitude;
      }

      const draftType = this.data.type;
      const did = this.data.did;
      const self = this;

      wx.chooseLocation({
        latitude: latitude,
        longitude: longitude,
        success: async (res) => {
          const locationInfo = {
            name: res.name,
            description: null,
            placeId: null,
            placeType: null,
            mapId: 5,
            latitude: res.latitude,
            longitude: res.longitude,
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
            moreInfo: null,
          };

          const resultRes = await fresnsApi.editor.draftUpdate(draftType, did, { locationInfo: locationInfo, gtid: '' });

          if (resultRes.code == 0) {
            self.setData({
              name: res.name,
            });
          }
        },
      });
    },
  },
});
