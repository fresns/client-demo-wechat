/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../api/api';
import { fresnsConfig, fresnsLang } from '../../../api/tool/function';
import { callPageFunction } from '../../../utils/fresnsUtilities';

Component({
  /** 组件的属性列表 **/
  properties: {
    value: {
      type: Object,
      value: null,
    },
    config: Object,
  },

  /** 组件的初始数据 **/
  data: {
    groupConfig: null,
    groupName: '小组',

    currentGroup: null,
    currentGroupName: '不发到任何小组',
    currentCategoryGid: null,

    show: false,

    categories: [],
    groups: [],
    page: 1,
    loadingStatus: false,
    loadingTipType: 'none',
    isReachBottom: false,
  },

  /** 组件数据字段监听器 **/
  observers: {
    value: async function (value) {
      if (!value) {
        this.setData({
          currentGroupName: await fresnsLang('editorNoGroup'),
        });

        return;
      }

      this.setData({
        currentGroup: value,
        currentGroupName: value.gname,
      });
    },

    config: function (config) {
      this.setData({
        groupConfig: config,
      });
    },
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      const categoriesRes = await fresnsApi.group.groupCategories({
        pageSize: 30,
      });

      let categories = [];
      if (categoriesRes.code === 0) {
        categories = categoriesRes.data.list;
      }

      const recommendRes = await fresnsApi.group.groupList({
        recommend: 1,
        whitelistKeys: 'gid,gname,cover,category.gid',
        pageSize: 1,
      });

      let recommendGroups = [];
      if (recommendRes.code === 0) {
        recommendGroups = recommendRes.data.list;
      }

      let items = [];
      if (!this.data.groupConfig.required) {
        items.push({
          gid: '__none',
          gname: await fresnsLang('editorNoGroup'),
          fresnsGroup: 'none',
        });
      }
      if (recommendGroups.length > 0) {
        items.push({
          gid: '__recommend',
          gname: await fresnsLang('contentRecommend'),
          fresnsGroup: 'recommend',
        });
      }

      if (items.length > 0) {
        categories.unshift(...items);
      }

      this.setData({
        groupName: await fresnsConfig('group_name'),
        categories: categories,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 关闭选择窗口
    close() {
      this.setData({
        show: false,
      });
    },

    // 选择小组
    onClickSelect: async function (e) {
      const currentGroup = this.data.currentGroup;
      const currentCategoryGid = currentGroup?.category?.gid;

      this.setData({
        currentCategoryGid: currentCategoryGid,
        groups: [],
        page: 1,
        loadingStatus: false,
        loadingTipType: 'none',
        isReachBottom: false,
        show: true,
      });

      await this.loadGroupList();
    },

    // 选择小组分类
    onClickCategory: async function (e) {
      const gid = e.currentTarget.dataset.gid;

      console.log('onClickCategory', gid);

      if (gid == '__none') {
        this.setData({
          currentGroup: {},
          currentGroupName: await fresnsLang('editorNoGroup'),
          currentCategoryGid: null,
          show: false,
        });

        callPageFunction('onGroupChange');

        return;
      }

      this.setData({
        currentCategoryGid: gid,
        groups: [],
        page: 1,
        loadingStatus: false,
        loadingTipType: 'none',
        isReachBottom: false,
      });

      await this.loadGroupList();
    },

    // 选择小组
    onClickGroup: async function (e) {
      const gid = e.currentTarget.dataset.gid;
      const groups = this.data.groups;
      const currentGroup = groups.find((group) => group.gid == gid);

      console.log('onClickGroup', gid);

      this.setData({
        currentGroup: currentGroup,
        currentGroupName: currentGroup.gname,
        show: false,
      });

      callPageFunction('onGroupChange', currentGroup);
    },

    // 加载小组列表
    loadGroupList: async function () {
      const gid = this.data.currentCategoryGid;
      if (!gid) {
        return;
      }

      if (this.data.isReachBottom) {
        return;
      }

      wx.showNavigationBarLoading();

      this.setData({
        loadingStatus: true,
      });

      let resultRes = {
        code: null,
        message: null,
        data: null,
      };

      if (gid == '__recommend') {
        resultRes = await fresnsApi.group.groupList({
          recommend: 1,
          whitelistKeys: 'gid,gname,cover,category.gid,publishRule',
        });
      } else {
        resultRes = await fresnsApi.group.groupList({
          gid: gid,
          whitelistKeys: 'gid,gname,cover,category.gid,publishRule',
        });
      }

      if (resultRes.code === 0) {
        const { paginate, list } = resultRes.data;
        const isReachBottom = paginate.currentPage === paginate.lastPage;
        const newGroups = this.data.groups.concat(list);

        let tipType = 'none';
        if (isReachBottom) {
          tipType = newGroups.length > 0 ? 'page' : 'empty';
        }

        this.setData({
          groups: newGroups,
          page: this.data.page + 1,
          loadingTipType: tipType,
          isReachBottom: isReachBottom,
        });
      }

      this.setData({
        loadingStatus: false,
      });

      wx.hideNavigationBarLoading();
    },
  },
});
