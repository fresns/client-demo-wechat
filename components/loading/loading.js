/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../api/tool/function';

Component({
    /** 组件的属性列表 **/
    properties: {
        status: Boolean,
        tipType: String, // none, page, empty
    },

    /** 组件的初始数据 **/
    data: {
        loading: '',
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
                const listWithoutPage = await fresnsLang('listWithoutPage');
                this.setData({
                    tipStatus: true,
                    tipText: listWithoutPage || '没有了',
                });
            }

            if (tipType == 'empty') {
                const listEmpty = await fresnsLang('listEmpty');
                this.setData({
                    tipStatus: true,
                    tipText: listEmpty || '列表为空，暂无内容',
                });
            }
        },
    },

    /** 组件生命周期声明对象 **/
    lifetimes: {
        attached: async function () {
            const loading = await fresnsLang('loading');

            this.setData({
                loading: loading || '正在加载',
            });
        },
    },
});
