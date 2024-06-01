/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    tabs: [],

    // 当前分页数据
    type: null,
    drafts: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const type = options.type || 'post';

    const tabs = [
      {
        text: await fresnsConfig('post_name'),
        type: 'post',
      },
      {
        text: await fresnsConfig('comment_name'),
        type: 'comment',
      },
    ];

    this.setData({
      title: await fresnsConfig('menu_editor_drafts'),
      type: type,
      tabs: tabs,
    });

    this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
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
      refresherStatus: false,
      loadingStatus: false,
    });
  },

  /** 监听用户下拉动作 **/
  onRefresherRefresh: async function () {
    if (isRefreshing) {
      console.log('下拉', '防抖');

      this.setData({
        refresherStatus: false,
      });

      return;
    }

    isRefreshing = true;

    this.setData({
      drafts: [],
      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingTipType: 'none',
    });

    this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  /** 监听用户上拉触底 **/
  onScrollToLower: async function () {
    if (isRefreshing) {
      console.log('上拉', '防抖');

      return;
    }

    isRefreshing = true;

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  // 切换类型
  onTapTab: async function (e) {
    const type = e.currentTarget.dataset.type;

    console.log('onTapTab', type);

    this.setData({
      // 当前分页数据
      type: type,
      drafts: [],

      // 分页配置
      page: 1, // 下次请求时候的页码，初始值为 1
      isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
      refresherStatus: false, // scroll-view 视图容器下拉刷新状态
      loadingStatus: false, // loading 组件状态
      loadingTipType: 'none', // loading 组件提示文案
    });

    this.loadFresnsPageData();
  },

  // 菜单
  onEditMenus: async function (e) {
    const items = [await fresnsLang('edit'), await fresnsLang('delete')];

    const type = this.data.type;
    const did = e.currentTarget.dataset.did;
    console.log('onEditMenus', did);

    wx.showActionSheet({
      alertText: did,
      itemList: items,
      success: async (res) => {
        // 编辑
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/editor/index?type=${type}&did=${did}`,
          });

          return;
        }

        // 删除
        const resultRes = await fresnsApi.editor.draftDelete(type, did);

        if (resultRes.code == 0) {
          const drafts = this.data.drafts;

          const idx = drafts.findIndex((value) => value.did == did);

          if (idx >= 0) {
            drafts.splice(idx, 1);

            this.setData({
              drafts: drafts,
            });
          }
        }
      },
      // success end
    });
    // 菜单结束
  },
});
