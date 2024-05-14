/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../../services';
import { fresnsConfig, fresnsLang, fresnsEditor } from '../../../helpers/configs';

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
    group: {
      type: Object,
      value: null,
    },
  },

  /** 组件的初始数据 **/
  data: {
    groupName: null,
    groupRequired: false,

    currentGroupCover: null,
    currentGroupName: null,

    selectDialog: false,

    fresnsLang: null,

    topGroups: [],
    allGroups: {}, // 将所有已加载小组存储，重新加载时不请求接口
    allParentInfo: {}, // 将所有父级小组信息存储，方便逐级查询

    currentParentInfo: {},
    currentGroups: [],

    loadingStatus: false,
    loadingTipType: 'none',
  },

  /** 组件生命周期声明对象 **/
  lifetimes: {
    attached: async function () {
      let currentGroupCover;
      let currentGroupName = await fresnsLang('editorNoSelectGroup');

      const group = this.data.group;
      if (group) {
        currentGroupCover = group.cover;
        currentGroupName = group.name;
      }

      let topGroups = this.data.topGroups;
      if (topGroups.length < 1) {
        const resultRes = await fresnsApi.group.list({
          topGroups: 1,
          filterType: 'whitelist',
          filterKeys: 'gid,name,cover,parentInfo,subgroupCount,publishRule',
        });

        if (resultRes.code == 0) {
          topGroups = resultRes.data.list;
        }
      }

      const type = this.data.type;

      this.setData({
        groupName: await fresnsConfig('group_name'),
        groupRequired: await fresnsEditor[type]('editor.group.required'),
        currentGroupCover: currentGroupCover,
        currentGroupName: currentGroupName,
        fresnsLang: await fresnsLang(),
        topGroups: topGroups,
        currentGroups: topGroups,
      });
    },
  },

  /** 组件功能 **/
  methods: {
    // 显示选择窗口
    onClickSelect: async function (e) {
      this.setData({
        selectDialog: true,
      });
    },

    // 关闭选择窗口
    close() {
      this.setData({
        selectDialog: false,
      });
    },

    // 不发到任何小组
    onClickNoGroup: async function () {
      console.log('onClickNoGroup');

      const type = this.data.type;
      const did = this.data.did;

      await fresnsApi.editor.draftUpdate(type, did, { gid: null });

      this.setData({
        currentGroupCover: null,
        currentGroupName: await fresnsLang('editorNoGroup'),
      });

      this.close();
    },

    // 选择小组
    onClickGroup: async function (e) {
      const gid = e.currentTarget.dataset.gid;
      const name = e.currentTarget.dataset.name;
      const cover = e.currentTarget.dataset.cover;

      console.log('onClickGroup', gid, name, cover);

      const type = this.data.type;
      const did = this.data.did;

      await fresnsApi.editor.draftUpdate(type, did, { gid: gid });

      this.setData({
        currentGroupCover: cover,
        currentGroupName: name,
      });

      this.close();
    },

    // 选择加载子级小组
    onLoadSubgroups: function (e) {
      const gid = e.currentTarget.dataset.gid;
      const name = e.currentTarget.dataset.name;
      const subgroupCount = e.currentTarget.dataset.subgroupCount;

      const parentGid = e.currentTarget.dataset.parentGid;
      const parentName = e.currentTarget.dataset.parentName;

      const currentParentInfo = {
        gid: gid,
        name: name,
        subgroupCount: subgroupCount,
      };

      const groupParentInfo = {
        gid: parentGid,
        name: parentName,
      };

      console.log('onLoadSubgroups', currentParentInfo, groupParentInfo);

      if (subgroupCount == 0) {
        return;
      }

      const allGroups = this.data.allGroups;
      const allParentInfo = this.data.allParentInfo;

      const currentGroups = allGroups[gid] || null;
      const checkParentInfo = allParentInfo[gid] || null;

      if (!checkParentInfo) {
        allParentInfo[gid] = groupParentInfo;
      }

      this.setData({
        allParentInfo: allParentInfo,
        currentParentInfo: currentParentInfo,
      });

      if (currentGroups) {
        this.setData({
          currentGroups: currentGroups.list,
        });

        return;
      }

      this.loadGroupList(gid);
    },

    onScrollToLower: function () {
      const currentParentInfo = this.data.currentParentInfo;

      console.log('onScrollToLower', currentParentInfo);

      if (!currentParentInfo.gid) {
        return;
      }

      this.loadGroupList(currentParentInfo.gid);
    },

    // 返回上一级小组
    onClickGoBack: function (e) {
      const gid = e.currentTarget.dataset.gid;

      const allGroups = this.data.allGroups;
      const allParentInfo = this.data.allParentInfo;

      const currentParentInfo = allParentInfo[gid] || null;

      let currentGroups = this.data.topGroups;
      if (currentParentInfo.gid) {
        currentGroups = allGroups[currentParentInfo.gid].list || [];
      }

      console.log('onClickGoBack', gid, currentGroups, currentParentInfo);

      this.setData({
        currentGroups: currentGroups,
        currentParentInfo: currentParentInfo,
      });
    },

    // 加载小组列表
    loadGroupList: async function (gid) {
      console.log('loadGroupList', gid);

      const allGroups = this.data.allGroups;

      const currentGroups = allGroups[gid] || {};

      const currentList = currentGroups.list || [];
      const currentPage = currentGroups.page || 1;
      const isReachBottom = currentGroups.isReachBottom || false;

      if (isReachBottom) {
        console.log('loadGroupList', 'isReachBottom', gid, isReachBottom);
        return;
      }

      this.setData({
        loadingStatus: true,
      });

      const resultRes = await fresnsApi.group.list({
        gid: gid,
        filterType: 'whitelist',
        filterKeys: 'gid,name,cover,parentInfo,subgroupCount,publishRule',
        page: currentPage,
      });

      if (resultRes.code == 0) {
        const { pagination, list } = resultRes.data;
        const isReachBottom = pagination.currentPage === pagination.lastPage;
        const newGroups = currentList.concat(list);

        let tipType = 'none';
        if (isReachBottom && currentPage > 1) {
          tipType = newGroups.length > 0 ? 'page' : 'empty';
        }

        currentGroups.isReachBottom = isReachBottom;
        currentGroups.list = newGroups;
        currentGroups.page = currentPage + 1;
        currentGroups.tipType = tipType;

        allGroups[gid] = currentGroups;

        this.setData({
          allGroups: allGroups,
          currentGroups: newGroups,
          loadingTipType: tipType,
        });
      }

      this.setData({
        loadingStatus: false,
      });
    },
  },
});
