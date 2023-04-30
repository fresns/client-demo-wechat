/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../../fresns';
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsCallback';

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

    /** 组件数据字段监听器 **/
    observers: {
        location: function (location) {
            const { tencentMapKey, tencentMapReferer } = appConfig;
            const locationInfo = JSON.stringify({
                latitude: location?.latitude,
                longitude: location?.longitude,
            });

            const mapUrl = `plugin://chooseLocation/index?key=${tencentMapKey}&referer=${tencentMapReferer}&location=${locationInfo}`;

            this.setData({
                mapUrl: mapUrl,
                poi: location?.poi,
            });
        },
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

    /** 组件所在页面的生命周期 **/
    pageLifetimes: {
        show: function () {
            const chooseLocation = requirePlugin('chooseLocation');
            const location = chooseLocation.getLocation();

            if (!location) {
                return;
            }

            const mapJson = {
                mapId: 5,
                latitude: location.latitude,
                longitude: location.longitude,
                scale: null,
                continent: null,
                continentCode: null,
                country: null,
                countryCode: null,
                region: location.province,
                regionCode: null,
                city: location.city,
                cityCode: null,
                district: location.district,
                address: location.address,
                zip: null,
                poi: location.name,
                poiId: null,
            };

            callPageFunction('onLocationChange', mapJson);
        },
    },

    /** 组件功能 **/
    methods: {
        // 添加位置
        onClickAddLocation: function () {
            const mapUrl = this.data.mapUrl;

            wx.navigateTo({
                url: mapUrl,
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
                const mapUrl = this.data.mapUrl;

                wx.navigateTo({
                    url: mapUrl,
                });
            }

            // 删除
            if (action == 'delete') {
                callPageFunction('onLocationDelete');
                this.setData({
                    poi: '',
                });
            }

            this.setData({
                showActionSheet: false,
            });
        },
    },
});
