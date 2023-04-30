/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../api/api';

/**
 * type        Number  NO  操作类型 1.建立 2.取消
 * markType    Number  NO  标记类型 1.点赞 2.关注 3.屏蔽
 * markTarget  Number  NO  标记目标 1.用户 / 2.小组 / 3.话题 / 4.帖子 / 5.评论
 */
module.exports = {
    data: {},
    onClickGroupLike: async function (e) {
        const groupsKey = 'groups';
        const group = e.currentTarget.dataset.group;
        // 当前未喜欢，点击喜欢
        if (group.likeStatus === 0) {
            const res = await this.actionLike(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].likeStatus`]: 1,
                    [`${groupsKey}[${idx}].likeCount`]: this.data.groups[idx].likeCount + 1,
                });
            }
            return;
        }

        // 当前已喜欢，点击取消喜欢
        if (group.likeStatus === 1) {
            const res = await this.actionUnLike(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].likeStatus`]: 0,
                    [`${groupsKey}[${idx}].likeCount`]: this.data.groups[idx].likeCount - 1,
                });
            }
            return;
        }
    },
    onClickGroupFollow: async function (e) {
        const groupsKey = 'groups';
        const group = e.currentTarget.dataset.group;
        // 当前未关注，点击关注
        if (group.followStatus === 0) {
            const res = await this.actionFollow(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].followStatus`]: 1,
                    [`${groupsKey}[${idx}].followCount`]: this.data.groups[idx].followCount + 1,
                });
            }
            return;
        }

        // 当前已关注，点击取消关注
        if (group.followStatus === 1) {
            const res = await this.actionUnFollow(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].followStatus`]: 0,
                    [`${groupsKey}[${idx}].followCount`]: this.data.groups[idx].followCount - 1,
                });
            }
            return;
        }
    },
    onClickGroupBlock: async function (e) {
        const groupsKey = 'groups';
        const group = e.currentTarget.dataset.group;
        // 当前未关注，点击关注
        if (group.blockStatus === 0) {
            const res = await this.actionBlock(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].blockStatus`]: 1,
                    [`${groupsKey}[${idx}].blockCount`]: this.data.groups[idx].blockCount + 1,
                });
            }
            return;
        }

        // 当前已关注，点击取消关注
        if (group.blockStatus === 1) {
            const res = await this.actionUnBlock(group.gid);
            if (res.code === 0) {
                const idx = this.data.groups.findIndex((value) => value.gid === group.gid);
                this.setData({
                    [`${groupsKey}[${idx}].blockStatus`]: 0,
                    [`${groupsKey}[${idx}].blockCount`]: this.data.groups[idx].blockCount - 1,
                });
            }
            return;
        }
    },
    actionLike: async function (id) {
        return fresnsApi.user.userMark({
            type: 1,
            markType: 1,
            markTarget: 2,
            markId: id,
        });
    },
    actionUnLike: async function (id) {
        return fresnsApi.user.userMark({
            type: 2,
            markType: 1,
            markTarget: 2,
            markId: id,
        });
    },
    actionFollow: async function (id) {
        return fresnsApi.user.userMark({
            type: 1,
            markType: 2,
            markTarget: 2,
            markId: id,
        });
    },
    actionUnFollow: async function (id) {
        return fresnsApi.user.userMark({
            type: 2,
            markType: 2,
            markTarget: 2,
            markId: id,
        });
    },
    actionBlock: async function (id) {
        return fresnsApi.user.userMark({
            type: 1,
            markType: 3,
            markTarget: 2,
            markId: id,
        });
    },
    actionUnBlock: async function (id) {
        return fresnsApi.user.userMark({
            type: 2,
            markType: 3,
            markTarget: 2,
            markId: id,
        });
    },
};
