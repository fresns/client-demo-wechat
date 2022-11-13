/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction';

Component({
    properties: {
        // 默认标题
        defaultTitle: String,
        // 标题是否强显示
        isHighlight: Boolean,
        // 标题是否必填
        isRequired: Boolean,
        // 标题长度限制
        limitLength: Number,
    },
    data: {
        title: '',
    },
    lifetimes: {
        attached: function () {
            this.setData({
                title: this.data.defaultTitle,
            });
        },
    },
    methods: {
        bindInput: function (e) {
            const { value } = e.detail;
            this.setData({
                title: value,
            });
            callPageFunction('onTitleChange', value);
            return value;
        },
    },
    observers: {
        defaultTitle: function (nDefaultTitle) {
            this.setData({
                title: nDefaultTitle,
            });
        },
    },
});
