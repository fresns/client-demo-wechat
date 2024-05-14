/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsLang } from '../../../helpers/configs';
import { isEmpty } from '../../../utilities/toolkit';

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
    fsid: {
      type: String,
      value: null,
    },
    options: {
      type: Object,
      value: {},
    },
  },

  /** 组件的初始数据 **/
  data: {
    selector: false,
    fresnsLang: {},
    drafts: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    ready: async function () {
      const type = this.data.type;
      const did = this.data.did; // 有值表示编辑指定草稿
      const fsid = this.data.fsid; // 有值表示编辑已发表的内容，将该内容生成草稿

      console.log('草稿选择器', type, did, fsid);

      // 无指定草稿, 无指定编辑内容
      if (!did && !fsid) {
        console.log('无指定草稿', '无指定编辑内容');

        // 是评论，不加载草稿列表，直接创建草稿
        if (type == 'comment') {
          await this.createDraft();

          return;
        }

        console.log('帖子加载草稿');
        await this.loadDraftList();

        this.setData({
          selector: true,
          fresnsLang: {
            modifierOr: await fresnsLang('modifierOr'),
            selectDraft: await fresnsLang('editorDraftSelect'),
            createDraft: await fresnsLang('editorDraftCreate'),
          },
        });

        // 没有草稿，自动创建新草稿
        if (this.data.drafts.length == 0) {
          console.log('没有草稿，自动创建新草稿');
          await this.createDraft();

          return;
        }
      }

      // 有指定草稿
      if (did) {
        console.log('有指定草稿');
        this.loadDraftDetail(did);

        return;
      }

      // 有指定编辑内容
      if (fsid) {
        console.log('有指定编辑内容', '将指定内容生成草稿');
        const generateRes = await fresnsApi.editor.edit(type, fsid);

        // 生成成功
        if (generateRes.code === 0) {
          console.log('将指定内容生成草稿', '生成成功');
          await this.enterEditor(generateRes.data);
        }
      }
    },
  },

  /** 组件功能 **/
  methods: {
    /** 加载草稿列表数据 **/
    loadDraftList: async function () {
      if (this.data.isReachBottom) {
        return;
      }

      this.setData({
        loadingStatus: true,
      });

      const type = this.data.type;

      const resultRes = await fresnsApi.editor.draftList(type, {
        page: this.data.page,
      });

      if (resultRes.code === 0) {
        const { pagination, list } = resultRes.data;
        const isReachBottom = pagination.currentPage === pagination.lastPage;

        const listCount = list.length + this.data.drafts.length;

        let tipType = 'none';
        if (isReachBottom && this.data.page > 1) {
          tipType = listCount > 0 ? 'page' : 'empty';
        }

        this.setData({
          drafts: this.data.drafts.concat(list),
          loadingTipType: tipType,
          isReachBottom: isReachBottom,
        });
      }

      this.setData({
        loadingStatus: false,
      });
    },

    /** 触底加载 **/
    onScrollToLower: async function () {
      console.log('loadDraftList', 'onScrollToLower');

      if (this.data.isReachBottom) {
        return;
      }

      this.loadDraftList();
    },

    /** 创建新草稿 **/
    createDraft: async function () {
      wx.showLoading({
        title: await fresnsLang('loading'), // 加载中...
      });

      const type = this.data.type;
      const options = this.data.options;

      const draftRes = await fresnsApi.editor.draftCreate(type, {
        createType: 2, // 编辑器创建
        commentPid: options.commentPid,
        commentCid: options.commentCid,
        quotePid: options.quotePid,
        gid: options.gid,
        title: options.title,
        content: options.content,
        isMarkdown: options.isMarkdown,
        isAnonymous: options.isAnonymous,
        commentPolicy: options.commentPolicy,
        commentPrivate: options.commentPrivate,
        gtid: options.gtid,
        locationInfo: options.locationInfo,
        archives: options.archives,
        extends: options.extends,
      });

      // 创建草稿成功
      if (draftRes.code === 0) {
        this.enterEditor(draftRes.data);
      }

      wx.hideLoading();
    },

    /** 获取指定草稿 **/
    loadDraftDetail: async function (did) {
      wx.showLoading({
        title: await fresnsLang('loading'), // 加载中...
      });

      const type = this.data.type;

      const detailRes = await fresnsApi.editor.draftDetail(type, did);

      // 获取成功
      if (detailRes.code === 0) {
        const options = this.data.options;

        // 是帖子，有指定的参数值，除内容外，其余可替换为指定值
        if (type == 'post') {
          options.content = null;

          // 删除空的健值对
          Object.getOwnPropertyNames(options).forEach((key) => {
            if (isEmpty(options[key])) {
              delete options[key];
            }
          });

          console.log('loadDraftDetail', 'draftUpdate', options);

          if (!isEmpty(options)) {
            await fresnsApi.editor.draftUpdate(type, did, options);
          }
        }

        this.enterEditor(detailRes.data);
      }

      wx.hideLoading();
    },

    // 选择草稿: 选择
    onClickChooseDraft: async function (e) {
      const did = e.currentTarget.dataset.did;
      console.log('onClickChooseDraft', 'did', did);

      this.loadDraftDetail(did);
    },

    // 选择草稿: 新创建
    onClickCreateDraft: async function () {
      console.log('Create Draft');

      this.createDraft();
    },

    /** 进入编辑器 **/
    enterEditor: async function (draftData) {
      this.triggerEvent('eventDraftChoose', { draftData });
    },
  },
});
