/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */

import Api from '../../api/api';
import { getConfigItemValue } from '../../api/tool/replace-key';

Page({
    mixins: [
        require('../../mixin/themeChanged'),
        require('../../mixin/imageGallery'),
        require('../../mixin/handler/postHandler'),
    ],
    data: {
        pid: null,
        // 详情
        posts: [],
        // 评论列表
        commentList: [],

        stickerShow: false,
        functionShow: false,

        quickCommentValue: '',
        quickCommentImage: null,

        isShowShareChoose: false,
    },
    sharePost: null,
    onLoad: async function (options) {
        const { pid } = options;
        this.setData({ pid: pid });
        const postDetailRes = await Api.content.postDetail({
            pid: pid,
        });
        if (postDetailRes.code === 0) {
            this.setData({
                posts: [postDetailRes.data.detail],
            });
        }
        await this.loadCommentList();
    },
    loadCommentList: async function () {
        const { pid } = this.data;
        const commentsRes = await Api.content.commentLists({
            searchPid: pid,
        });
        if (commentsRes.code === 0) {
            this.setData({
                commentList: commentsRes.data.list,
            });
        }
    },
    onInputChange: function (e) {
        const value = e.detail.value;
        this.setData({
            quickCommentValue: value,
        });
        return value;
    },
    onSelectImage: function (e) {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                const { tempFilePaths, tempFiles } = res;
                const uploadRes = await Api.editor.editorUpload(tempFilePaths[0], {
                    type: 1,
                    tableType: 8,
                    tableName: 'post_logs',
                    tableColumn: 'files_json',
                    mode: 1,
                    file: tempFilePaths[0],
                });

                const resultFile = uploadRes.data.files[0];
                this.setData({
                    quickCommentImage: resultFile,
                });
            },
        });
    },
    quickComment: async function () {
        const publishRes = await Api.editor.editorPublish({
            type: 2,
            commentPid: this.data.pid,
            content: this.data.quickCommentValue,
            isMarkdown: 0,
            isAnonymous: 0,
            file: this.data.quickCommentImage,
        });
        if (publishRes.code === 0) {
            wx.showToast({
                title: '发布成功',
                icon: 'none',
            });
            this.setData({ quickCommentValue: '', quickCommentImage: null });
            await this.loadCommentList();
        }
    },
    /**
     * post 列表点击分享按钮
     */
    onClickShare: async function (post) {
        this.sharePost = post;
        this.setData({
            isShowShareChoose: true,
        });
    },
    /**
     * 点击复制网址
     */
    onClickCopyPath: async function () {
        const domain = await getConfigItemValue('site_domain');
        const res = `${domain}/post/${this.sharePost.pid}`;
        wx.setClipboardData({ data: res });
    },
    onClickCancelShareChoose: function () {
        this.setData({
            isShowShareChoose: false,
        });
    },
    /** 右上角菜单-分享给好友 **/
    onShareAppMessage: function (options) {
        const { from, target, webViewUrl } = options;

        if (from === 'button') {
            const { title, pid } = this.sharePost;
            return {
                title: title,
                path: `/pages/posts/detail?pid=${pid}`,
            };
        }

        return {
            title: 'Fresns',
        };
    },
    /** 右上角菜单-分享到朋友圈 **/
    onShareTimeline: function () {
        return {
            title: 'Fresns',
        };
    },
});
