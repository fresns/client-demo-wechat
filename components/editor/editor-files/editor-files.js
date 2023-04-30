/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsCallback';

Component({
    /** 组件的属性列表 **/
    properties: {
        files: Object,
    },

    /** 组件的初始数据 **/
    data: {
        images: [],
        videos: [],
        audios: [],
        documents: [],

        showActionSheet: false,
        menus: [],
        cancel: '取消',
        imageUrls: [],
    },

    /** 组件数据字段监听器 **/
    observers: {
        files: function (files) {
            let urls = [];
            if (files.images) {
                urls = files.images.map((image) => image.imageBigUrl);
            }

            this.setData({
                images: files.images,
                videos: files.videos,
                audios: files.audios,
                documents: files.documents,
                imageUrls: urls,
            });
        },
    },

    /** 组件生命周期声明对象 **/
    lifetimes: {
        attached: async function () {
            this.setData({
                cancel: await fresnsLang('cancel'),
            });
        },
    },

    /** 组件功能 **/
    methods: {
        // 关闭菜单
        close() {
            this.setData({
                showActionSheet: false,
            });
        },

        // 文件菜单
        handleFiles: async function (e) {
            const { type, fid, url } = e.currentTarget.dataset;

            let menus = [];

            // 查看
            if (url) {
                menus.push({
                    text: await fresnsLang('view'),
                    type: 'default',
                    fid: fid,
                    fileType: type,
                    url: url,
                    action: 'view',
                });
            }

            // 删除
            menus.push({
                text: await fresnsLang('delete'),
                type: 'warn',
                fid: fid,
                fileType: type,
                url: '',
                action: 'delete',
            });

            this.setData({
                menus: menus,
                showActionSheet: true,
            });
        },

        // 菜单操作
        onClickFile(e) {
            const { type, fid, url, action } = e.currentTarget.dataset;

            if (action == 'delete') {
                callPageFunction('onDeleteFile', type, fid);

                return;
            }

            wx.previewImage({
                current: url,
                urls: this.data.imageUrls,
            });
        },
    },
});
