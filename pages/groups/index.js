/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services';
import { fresnsConfig } from '../../sdk/helpers/configs';
import { parseUrlParams } from '../../sdk/utilities/toolkit';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../mixins/fresnsInteraction'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,
    viewType: 'tree',

    // 默认查询条件
    requestState: null,
    requestQuery: null,

    // 当前树数据
    tree: [],
    treeGroups: [],
    currentTreeGid: null,

    // 当前分页数据
    groups: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    refresherStatus: false, // scroll-view 视图容器下拉刷新状态
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    let requestState = await fresnsConfig('channel_group_query_state');
    let requestQuery = parseUrlParams(await fresnsConfig('channel_group_query_config'));

    if (requestState === 3) {
      requestQuery = Object.assign(requestQuery, options);
    }

    this.setData({
      title: await fresnsConfig('channel_group_name'),
      viewType:  await fresnsConfig('channel_group_type'),
      requestState: requestState,
      requestQuery: requestQuery,
    });

    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    switch (this.data.viewType) {
      case 'tree':
        const treeRes = await fresnsApi.group.tree();

        if (treeRes.code === 0) {
          this.setData({
            tree: treeRes.data,
            treeGroups: treeRes.data[0].groups,
            currentTreeGid: treeRes.data[0].gid,
          });
        }
        break;

      case 'list':
        const resultRes = await fresnsApi.group.list(
          Object.assign(this.data.requestQuery, {
            filterType: 'blacklist',
            filterKeys: 'archives,operations',
            page: this.data.page,
          })
        );

        if (resultRes.code === 0) {
          const { pagination, list } = resultRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.groups.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            groups: this.data.groups.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      default:
        return;
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
      groups: [],
      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingTipType: 'none',
    });

    await this.loadFresnsPageData();

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

    // 不接受客户端传参，包括分页
    if (this.data.requestState == 1) {
      this.setData({
        loadingTipType: this.data.group.length > 0 ? 'page' : 'empty',
        isReachBottom: true,
      });
      return;
    }

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },

  onSwitchGroups: function (e) {
    const index = e.currentTarget.dataset.index;
    const tree = this.data.tree;

    this.setData({
      treeGroups: tree[index].groups,
      currentTreeGid: tree[index].gid,
    });
  }
});
