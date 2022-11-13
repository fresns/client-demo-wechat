/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction';

Component({
    properties: {
        location: Object,
    },
    data: {
        poi: null,
        isShowSelectModal: false,
    },
    methods: {
        handleClickAddLocation: async function () {
            callPageFunction('onSelectLocation');
        },
        onClickReLocation: function () {
            callPageFunction('onSelectLocation');
            this.onClickCloseModal();
        },
        onClickDeleteLocation: function () {
            callPageFunction('onDeleteLocation');
            this.onClickCloseModal();
        },
        onClickShowModal: function () {
            this.setData({
                isShowSelectModal: true,
            });
        },
        onClickCloseModal: function () {
            this.setData({
                isShowSelectModal: false,
            });
        },
    },
    observers: {
        location: function (params) {
            this.setData({
                poi: params?.poi,
            });
        },
    },
});
