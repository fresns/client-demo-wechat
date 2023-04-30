/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsLang } from '../../../api/tool/function';
import { enJson } from '../../../utils/fresnsUtilities';
import { callPageFunction } from '../../../utils/fresnsCallback';

Component({
    /** 组件的属性列表 **/
    properties: {
        options: {
            type: Object,
            value: null,
        },
    },

    /** 组件的初始数据 **/
    data: {
        fsLang: {},

        type: null,
        internalOptions: {},
        createBtn: false,

        posts: [],
        page: 1,
        loadingStatus: false,
        loadingTipType: 'none',
        isReachBottom: false,
    },

    /** 组件数据字段监听器 **/
    observers: {
        options: async function (options) {
            this.setData({
                type: options.type || 'post',
                internalOptions: options,
            });
        },
    },

    /** 组件生命周期声明对象 **/
    lifetimes: {
        attached: async function () {
            this.setData({
                fsLang: {
                    selectDraft: await fresnsLang('editorDraftSelect'),
                    createDraft: await fresnsLang('editorDraftCreate'),
                },
            });

            const type = this.data.type; // 内容类型，帖子或评论
            const fsid = this.data.internalOptions.fsid; // 有值表示编辑已发表的内容
            const draftId = this.data.internalOptions.draftId; // 有值表示编辑指定草稿

            // 无指定编辑内容，无指定草稿
            if (!fsid && !draftId) {
                // 如果是评论，不加载草稿列表，直接创建草稿
                if (type == 'comment') {
                    await this.createDraft();

                    return;
                }

                // 帖子加载草稿
                await this.loadDraftList();

                // 没有草稿，自动创建新草稿
                console.log('draft', this.data.posts.length);
                if (this.data.posts.length == 0) {
                    await this.createDraft();

                    return;
                }
            }

            // 有指定编辑内容
            if (fsid) {
                // 将指定内容生成草稿
                const generateRes = await fresnsApi.editor.editorGenerate({
                    type: type,
                    fsid: fsid,
                });

                // 生成成功
                if (generateRes.code === 0) {
                    await this.enterEditor(generateRes.data);
                }

                return;
            }

            // 有指定草稿
            if (draftId) {
                await this.loadDraftDetail(draftId);
            }
        },
    },

    /** 组件功能 **/
    methods: {
        /** 加载草稿列表数据 **/
        loadDraftList: async function () {
            const type = this.data.type;

            if (this.data.isReachBottom || type != 'post') {
                return;
            }

            wx.showNavigationBarLoading();

            this.setData({
                loadingStatus: true,
            });

            const resultRes = await fresnsApi.editor.editorDrafts({
                type: type,
                status: 1,
                page: this.data.page,
            });

            if (resultRes.code === 0) {
                const { paginate, list } = resultRes.data;
                const isReachBottom = paginate.currentPage === paginate.lastPage;
                const newPosts = this.data.posts.concat(list);

                console.log('posts', newPosts.length);

                let tipType = 'none';
                if (isReachBottom) {
                    tipType = newPosts.length > 0 ? 'page' : 'empty';
                }

                this.setData({
                    posts: newPosts,
                    page: this.data.page + 1,
                    loadingTipType: tipType,
                    isReachBottom: isReachBottom,
                });
            }

            this.setData({
                loadingStatus: false,
                createBtn: true,
            });

            wx.hideNavigationBarLoading();
        },

        /** 创建新草稿 **/
        createDraft: async function () {
            wx.showNavigationBarLoading();

            const options = this.data.internalOptions;
            const type = this.data.type;

            // 评论必填参数判断
            if (type == 'comment' && !options.commentPid) {
                this.setData({
                    tipError: '评论缺失 pid 参数',
                    tipDelay: 20000,
                });

                return;
            }

            const draftRes = await fresnsApi.editor.editorCreate({
                type: type,
                createType: 2,
                postQuotePid: options.postQuotePid,
                postGid: options.postGid,
                postTitle: options.postTitle,
                postIsComment: options.postIsComment,
                postIsCommentPublic: options.postIsCommentPublic,
                commentPid: options.commentPid,
                commentCid: options.commentCid,
                content: options.content,
                isMarkdown: options.isMarkdown,
                isAnonymous: options.isAnonymous,
                map: options.map ? enJson(options.map) : '',
                extends: options.extends ? enJson(options.extends) : '',
                archives: options.archives ? enJson(options.archives) : '',
            });

            // 创建草稿成功
            if (draftRes.code === 0) {
                await this.enterEditor(draftRes.data);
            }

            wx.hideNavigationBarLoading();
        },

        /** 获取指定草稿 **/
        loadDraftDetail: async function (draftId) {
            wx.showNavigationBarLoading();

            const type = this.data.type;

            const detailRes = await fresnsApi.editor.editorDetail({
                type: type,
                draftId: draftId,
            });

            // 获取成功
            if (detailRes.code === 0) {
                await this.enterEditor(detailRes.data);
            }

            wx.hideNavigationBarLoading();
        },

        // 选择草稿: 选择
        onClickChooseDraft: async function (e) {
            await this.loadDraftDetail(e.currentTarget.dataset.id);
        },

        // 选择草稿: 新创建
        onClickCreateDraft: async function () {
            console.log('Create Draft');

            await this.createDraft();
        },

        /** 进入编辑器 **/
        enterEditor: async function (draftData) {
            callPageFunction('onLoadDraft', draftData);
        },
    },
});
