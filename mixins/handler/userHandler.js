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

    onClickUserLike: async function (e) {
        const usersKey = 'users';
        const user = e.currentTarget.dataset.user;
        // 当前未喜欢，点击喜欢
        if (!user.interaction.likeStatus) {
            const res = await this.actionLike(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.likeStatus`]: 1,
                    [`${usersKey}[${idx}].interaction.dislikeStatus`]: 0,
                    [`${usersKey}[${idx}].stats.likeMeCount`]: this.data.users[idx].stats.likeMeCount + 1,
                });
            }
            return;
        }

        // 当前已喜欢，点击取消喜欢
        if (user.interaction.likeStatus) {
            const res = await this.actionLike(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.likeStatus`]: 0,
                    [`${usersKey}[${idx}].stats.likeMeCount`]: this.data.users[idx].stats.likeMeCount - 1,
                });
            }
            return;
        }
    },

    onClickUserDislike: async function (e) {
        const usersKey = 'users';
        const user = e.currentTarget.dataset.user;
        // 当前未喜欢，点击喜欢
        if (!user.interaction.dislikeStatus) {
            const res = await this.actionDislike(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.dislikeStatus`]: 1,
                    [`${usersKey}[${idx}].interaction.likeStatus`]: 0,
                    [`${usersKey}[${idx}].stats.dislikeMeCount`]: this.data.users[idx].stats.dislikeMeCount + 1,
                });
            }
            return;
        }

        // 当前已喜欢，点击取消喜欢
        if (user.interaction.dislikeStatus) {
            const res = await this.actionDislike(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.dislikeStatus`]: 0,
                    [`${usersKey}[${idx}].stats.dislikeMeCount`]: this.data.users[idx].stats.dislikeMeCount - 1,
                });
            }
            return;
        }
    },

    onClickUserFollow: async function (e) {
        const usersKey = 'users';
        const user = e.currentTarget.dataset.user;
        // 当前未关注，点击关注
        if (!user.interaction.followStatus) {
            const res = await this.actionFollow(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.followStatus`]: 1,
                    [`${usersKey}[${idx}].interaction.blockStatus`]: 0,
                    [`${usersKey}[${idx}].stats.followMeCount`]: this.data.users[idx].stats.followMeCount + 1,
                });
            }
            return;
        }

        // 当前已关注，点击取消关注
        if (user.interaction.followStatus) {
            const res = await this.actionUnFollow(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.followStatus`]: 0,
                    [`${usersKey}[${idx}].stats.followMeCount`]: this.data.users[idx].stats.followMeCount - 1,
                });
            }
            return;
        }
    },

    onClickUserBlock: async function (e) {
        const usersKey = 'users';
        const user = e.currentTarget.dataset.user;
        // 当前未关注，点击关注
        if (!user.interaction.blockStatus) {
            const res = await this.actionBlock(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.blockStatus`]: 1,
                    [`${usersKey}[${idx}].interaction.followStatus`]: 0,
                    [`${usersKey}[${idx}].stats.blockMeCount`]: this.data.users[idx].stats.blockMeCount + 1,
                });
            }
            return;
        }

        // 当前已关注，点击取消关注
        if (user.interaction.blockStatus) {
            const res = await this.actionUnBlock(user.uid);
            if (res.code === 0) {
                const idx = this.data.users.findIndex((value) => value.uid === user.uid);
                this.setData({
                    [`${usersKey}[${idx}].interaction.blockStatus`]: 0,
                    [`${usersKey}[${idx}].stats.blockMeCount`]: this.data.users[idx].stats.blockMeCount - 1,
                });
            }
            return;
        }
    },

    // 请求接口
    actionLike: async function (fsid) {
        return fresnsApi.user.userMark({
            interactionType: 'like',
            markType: 'user',
            fsid: fsid,
        });
    },
    actionDislike: async function (fsid) {
        return fresnsApi.user.userMark({
            interactionType: 'dislike',
            markType: 'user',
            fsid: fsid,
        });
    },
    actionFollow: async function (fsid) {
        return fresnsApi.user.userMark({
            interactionType: 'follow',
            markType: 'user',
            fsid: fsid,
        });
    },
    actionBlock: async function (fsid) {
        return fresnsApi.user.userMark({
            interactionType: 'block',
            markType: 'user',
            fsid: fsid,
        });
    },
};
