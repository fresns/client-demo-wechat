/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction';

Component({
    properties: {
        isAnonymous: Number,
    },
    data: {
        isEnableAnonymous: false,
    },
    methods: {
        bindSwitchAnonymous: function (e) {
            const { value } = e.detail;
            const isAnonymous = value.length > 0;
            this.setData({
                isEnableAnonymous: isAnonymous,
            });
            callPageFunction('onSwitchAnonymous', isAnonymous);
        },
    },
    observers: {
        isAnonymous: function (params) {
            this.setData({
                isEnableAnonymous: !!params,
            });
        },
    },
});
