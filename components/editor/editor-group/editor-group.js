/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../../api/api';

Component({
    properties: {
        // 小组是否必选
        isRequired: Boolean,
        value: String,
    },
    data: {
        currentGroup: null,
        currentGroupName: '不发到任何小组',
        groupCategoryList: null,
        groupList: null,
        multiArray: [],
        multiIndex: [0, 0],
        isObserver: false,
    },
    observers: {
        value: async function (value) {
            if (!value || this.data.isObserver) {
                return;
            }
            const groupDetailRes = await Api.content.groupDetail({
                gid: value,
            });
            this.setData({
                currentGroupName: groupDetailRes?.data?.detail?.gname,
                isObserver: true,
            });
        },
    },
    lifetimes: {
        attached: async function () {
            const that = this;
            // 获取小组分类
            const groupCategoryRes = await Api.content.groupLists({
                type: 1,
            });
            const groupCategoryList = groupCategoryRes.data.list.map((item) => ({
                value: item.gid,
                name: item.gname,
            }));
            groupCategoryList.unshift({
                value: null,
                name: '不发到任何小组',
            });
            this.setData({
                groupCategoryList: groupCategoryList,
                multiArray: [groupCategoryList, []],
            });
        },
    },
    bindGroupChange: function (e) {
        this.setData({
            value1: e.detail.value,
        });
    },
    methods: {
        bindMultiPickerChange: function (e) {
            let value = e.detail.value,
                groupList = this.data.groupList,
                currentGroup = value[0] !== 0 ? groupList[value[1]].value : null,
                currentGroupName = value[0] !== 0 ? groupList[value[1]].name : '不发到任何小组';
            this.setData({
                currentGroup,
                currentGroupName,
            });
            this.triggerEvent('change', {
                value: currentGroup,
            });
        },
        bindMultiPickerColumnChange: function (e) {
            let that = this,
                value = e.detail.value,
                groupCategoryList = this.data.groupCategoryList,
                multiIndex = that.data.multiIndex;
            switch (e.detail.column) {
                case 0:
                    let gid = groupCategoryList[value].value;
                    if (!gid) {
                        that.setData({
                            groupList: [],
                            multiArray: [groupCategoryList, []],
                        });
                    } else {
                        Api.content
                            .groupLists({
                                type: 2,
                                parentGid: gid,
                            })
                            .then(function (groupListRes) {
                                const groupList = groupListRes.data.list.map((item) => ({
                                    value: item.gid,
                                    name: item.gname,
                                }));
                                multiIndex[0] = value;
                                that.setData({
                                    groupList: groupList,
                                    multiArray: [groupCategoryList, groupList],
                                    multiIndex,
                                });
                            });
                    }
                    break;
                case 1:
                    multiIndex[1] = value;
                    that.setData({
                        multiIndex,
                    });
                    break;
            }
        },
    },
});
