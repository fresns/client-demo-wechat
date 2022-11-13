/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction';
import Api from '../../../api/api';

Component({
    properties: {
        // 编辑器
        editorConfig: Object,
        tableId: String,
    },
    data: {
        showType: null,
        stickersList: null,

        onUserTextChange: null,
        onHashtagsTextChange: null,
        tabs: [],
    },
    tempUsers: null,
    tempHashtags: null,
    lifetimes: {
        attached: async function () {
            const that = this;
            this.setData({
                // 用户搜索
                onUserTextChange: async function (search) {
                    if (!search) return;

                    const tipsRes = await Api.info.infoInputTips({
                        queryType: 1,
                        queryKey: search,
                    });
                    that.tempUsers = tipsRes.data;
                    return tipsRes.data.map((v) => ({
                        text: v.nickname + ' @' + v.name,
                        value: v.name,
                        id: v.fsid,
                    }));
                },
                // 话题搜索
                onHashtagsTextChange: async function (search) {
                    if (!search) return;

                    const tipsRes = await Api.info.infoInputTips({
                        queryType: 3,
                        queryKey: search,
                    });
                    that.tempHashtags = tipsRes.data;
                    return tipsRes.data.map((v) => ({
                        text: v.name,
                        id: v.fsid,
                    }));
                },
            });

            const stickersRes = await Api.info.infoStickers();
            const stickersList = stickersRes.data.list;
            this.setData({
                stickersList: stickersList,
                tabs: stickersList.map((item) => ({
                    title: item.name,
                    name: item.name,
                    image: item.image,
                    count: item.count,
                    sticker: item.sticker,
                })),
            });
        },
    },
    methods: {
        onClickToolBar: function (e) {
            const { type } = e.currentTarget.dataset;
            const { tableId } = this.data;

            if (['audio', 'doc'].includes(type)) {
                return wx.showToast({
                    title: '由于小程序限制，请到网站或 App 操作上传',
                    icon: 'none',
                });
            }
            if ('image' === type) {
                return setTimeout(() => {
                    this._onSelectImage(tableId);
                }, 100);
            }
            if ('video' === type) {
                return setTimeout(() => {
                    this._onSelectVideo(tableId);
                }, 100);
            }
            if ('title' === type) {
                return callPageFunction('switchTitleInputShow');
            }
            this.setData({ showType: type || null });
        },
        onSearchUsers: function (e) {
            const { id } = e.detail.item;
            callPageFunction(
                'onSelectUser',
                this.tempUsers?.find((v) => v.id === id)
            );
            this.setData({ showType: null });
        },
        onSearchHashtags: function (e) {
            const { id } = e.detail.item;
            callPageFunction(
                'onSelectHashtags',
                this.tempHashtags?.find((v) => v.id === id)
            );
            this.setData({ showType: null });
        },
        /**
         * sticker 选择回调
         * @param e
         */
        onSelectSticker: function (e) {
            const { sticker } = e.target.dataset;
            this.setData({ showType: null });
            callPageFunction('onSelectSticker', sticker);
        },
        /**
         * 选择图片
         */
        _onSelectImage: function (tableId) {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: async (res) => {
                    const { tempFilePaths, tempFiles } = res;
                    const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
                        type: 1,
                        tableType: 8,
                        tableId,
                        tableName: 'post_logs',
                        tableColumn: 'files_json',
                        mode: 1,
                        file: tempFilePaths[0],
                    });
                    const resultFile = uploadRes.data.files[0];
                    callPageFunction('onAddedFile', resultFile);
                    this.setData({ showType: null });
                },
            });
        },
        /**
         * 选择视频
         */
        _onSelectVideo: function (tableId) {
            wx.chooseVideo({
                success: async (res) => {
                    const { duration, tempFilePath, thumbTempFilePath, width, height, size } = res;
                    const uploadRes = await Api.editor.editorUpload(tempFilePath, {
                        type: 2,
                        tableType: 8,
                        tableName: 'post_logs',
                        tableColumn: 'files_json',
                        tableId: tableId,
                        mode: 1,
                        file: tempFilePath,
                    });

                    const resultFile = uploadRes.data.files[0];
                    callPageFunction('onAddedFile', resultFile);
                    this.setData({ showType: null });
                },
            });
        },
        /**
         * 点击扩展
         */
        onClickExpand: async function (e) {
            const { expand } = e.target.dataset;
            callPageFunction('onSelectExpand', expand);
        },
        nothing: function () {},
    },
});
