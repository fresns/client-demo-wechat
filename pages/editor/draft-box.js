/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';
import { fresnsConfig, fresnsLang } from '../../api/tool/function';

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/themeChanged'),
    require('../../mixins/checkSiteMode'),
    require('../../mixins/loginInterceptor'),
  ],

  /** 页面的初始数据 **/
  data: {
    tabs: [],
    activeIndex: 0,

    // 当前页面数据
    type: null,
    posts: [],
    comments: [],

    // 下次请求时候的页码，初始值为 1
    page: 1,

    // 加载状态
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,

    // 菜单
    id: null,
    title: null,
    showActionSheet: false,
    actionGroups: [],
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    wx.setNavigationBarTitle({
      title: await fresnsConfig('menu_editor_drafts'),
    });

    const type = options.type || 'post';

    const items = [
      {
        text: await fresnsLang('edit'),
        type: 'default',
        value: 'edit',
      },
      {
        text: await fresnsLang('delete'),
        type: 'warn',
        value: 'delete',
      },
    ];

    this.setData({
      type: type,
      activeIndex: type == 'post' ? 0 : 1,
      tabs: [await fresnsConfig('post_name'), await fresnsConfig('comment_name')],
      actionGroups: items,
    });

    await this.loadFresnsPageData();
  },

  // Tab 切换
  tabClick: async function (e) {
    console.log(e);
    this.setData({
      activeIndex: e.currentTarget.id,
      type: e.currentTarget.id == 0 ? 'post' : 'comment',
      posts: [],
      comments: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    wx.showNavigationBarLoading();

    this.setData({
      loadingStatus: true,
    });

    const type = this.data.type;

    const resultRes = await fresnsApi.editor.editorDrafts({
      type: type,
      page: this.data.page,
    });

    if (resultRes.code === 0) {
      const { paginate, list } = resultRes.data;
      const isReachBottom = paginate.currentPage === paginate.lastPage;

      let newPosts = [];
      let newComments = [];
      let tipType = 'none';

      if (type === 'post') {
        newPosts = this.data.posts.concat(list);
        if (isReachBottom) {
          tipType = newPosts.length > 0 ? 'page' : 'empty';
        }
      } else {
        newComments = this.data.comments.concat(list);
        if (isReachBottom) {
          tipType = newComments.length > 0 ? 'page' : 'empty';
        }
      }

      this.setData({
        posts: newPosts,
        comments: newComments,
        loadingTipType: tipType,
        isReachBottom: isReachBottom,
      });
    }

    this.setData({
      loadingStatus: false,
    });

    wx.hideNavigationBarLoading();
  },

  /** 监听用户下拉动作 **/
  onPullDownRefresh: async function () {
    this.setData({
      posts: [],
      comments: [],
      page: 1,
      loadingTipType: 'none',
      isReachBottom: false,
    });

    await this.loadFresnsPageData();
    wx.stopPullDownRefresh();
  },

  /** 监听用户上拉触底 **/
  onReachBottom: async function () {
    await this.loadFresnsPageData();
  },

  onEditMenus(data) {
    this.setData({
      id: data.currentTarget.dataset.id,
      title: data.currentTarget.dataset.title,
      showActionSheet: true,
    });
  },

  actionClickMenu: async function (e) {
    const value = e.detail.value;
    const id = this.data.id;
    const type = this.data.type;

    // 编辑
    if (value === 'edit') {
      wx.navigateTo({
        url: '/pages/editor/index?type=' + type + '&draftId=' + id,
      });

      this.setData({
        showActionSheet: false,
      });
    }

    // 删除
    if (value === 'delete') {
      const resultRes = await fresnsApi.editor.editorDelete({
        type: type,
        draftId: id,
      });

      if (resultRes.code === 0) {
        const list = type == 'post' ? this.data.posts : this.data.comments;

        const idx = list.findIndex((value) => value.id === id);

        if (idx >= 0) {
          list.splice(idx, 1);

          this.setData({
            posts: type == 'post' ? list : [],
            comments: type == 'comment' ? list : [],
          });
        }
      }

      this.setData({
        showActionSheet: false,
      });
    }
  },
});
