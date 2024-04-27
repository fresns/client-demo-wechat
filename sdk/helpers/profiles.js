/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../services';
import { fresnsConfig } from '../helpers/configs';
import { cachePut, cacheGet } from '../helpers/cache';
import { dataGet } from '../utilities/toolkit';

// fresnsAuth
class authInfo {
  get aid() {
    return wx.getStorageSync('aid') || null;
  }

  get aidToken() {
    return wx.getStorageSync('aidToken') || null;
  }

  get uid() {
    return wx.getStorageSync('uid') || null;
  }

  get uidToken() {
    return wx.getStorageSync('uidToken') || null;
  }

  get accountLogin() {
    return Boolean(this.aid && this.aidToken);
  }

  get userLogin() {
    return Boolean(this.aid && this.aidToken && this.uid && this.uidToken);
  }
}

// fresnsAccount
async function fresnsAccount(key = null) {
  if (!fresnsAuth.accountLogin) {
    return null;
  }

  let accountDetail = cacheGet('fresnsAccountData');

  if (!accountDetail) {
    const result = await fresnsApi.account.detail();

    if (result.code == 0) {
      cachePut('fresnsAccountData', result.data);
    }

    accountDetail = result.data;
  }

  if (!key) {
    return accountDetail;
  }

  return dataGet(accountDetail, key);
}

// fresnsUser
async function fresnsUser(key = null) {
  if (!fresnsAuth.userLogin) {
    return null;
  }

  let userDetail = cacheGet('fresnsUserData');

  if (!userDetail) {
    const result = await fresnsApi.user.detail(fresnsAuth.uid);

    if (result.code == 0) {
      cachePut('fresnsUserData', result.data);
    }

    userDetail = result.data;
  }

  if (!key) {
    return userDetail;
  }

  return dataGet(userDetail, key);
}

// fresnsOverview
async function fresnsOverview(key = null, uid = null) {
  if (!fresnsAuth.accountLogin) {
    return null;
  }

  let cacheKey = 'fresnsUserOverview';
  if (uid && fresnsAuth.uid != uid) {
    cacheKey = 'fresnsUserOverview' + '_' + uid;
  }

  let userOverview = cacheGet(cacheKey);

  if (!userOverview) {
    const result = await fresnsApi.user.overview({
      uidOrUsername: uid,
    });

    if (result.code == 0) {
      cachePut(cacheKey, result.data, 1, 'fresnsCacheOverviewTags');
    }

    userOverview = result.data;
  }

  if (!key) {
    return userOverview;
  }

  return dataGet(userOverview, key);
}

// fresnsViewProfilePath
async function fresnsViewProfilePath(fsid = null) {
  const profileDefaultHomepage = await fresnsConfig('profile_default_homepage');

  const typeMapping = {
    posts: '/pages/profile/posts?fsid=',
    comments: '/pages/profile/comments?fsid=',
    likers: '/pages/profile/interactions/likers?fsid=',
    dislikers: '/pages/profile/interactions/dislikers?fsid=',
    followers: '/pages/profile/interactions/followers?fsid=',
    blockers: '/pages/profile/interactions/blockers?fsid=',
    likes_users: '/pages/profile/likes/users?fsid=',
    likes_groups: '/pages/profile/likes/groups?fsid=',
    likes_hashtags: '/pages/profile/likes/hashtags?fsid=',
    likes_geotags: '/pages/profile/likes/geotags?fsid=',
    likes_posts: '/pages/profile/likes/posts?fsid=',
    likes_comments: '/pages/profile/likes/comments?fsid=',
    dislikes_users: '/pages/profile/dislikes/users?fsid=',
    dislikes_groups: '/pages/profile/dislikes/groups?fsid=',
    dislikes_hashtags: '/pages/profile/dislikes/hashtags?fsid=',
    dislikes_geotags: '/pages/profile/dislikes/geotags?fsid=',
    dislikes_posts: '/pages/profile/dislikes/posts?fsid=',
    dislikes_comments: '/pages/profile/dislikes/comments?fsid=',
    following_users: '/pages/profile/following/users?fsid=',
    following_groups: '/pages/profile/following/groups?fsid=',
    following_hashtags: '/pages/profile/following/hashtags?fsid=',
    following_geotags: '/pages/profile/following/geotags?fsid=',
    following_posts: '/pages/profile/following/posts?fsid=',
    following_comments: '/pages/profile/following/comments?fsid=',
    blocking_users: '/pages/profile/blocking/users?fsid=',
    blocking_groups: '/pages/profile/blocking/groups?fsid=',
    blocking_hashtags: '/pages/profile/blocking/hashtags?fsid=',
    blocking_geotags: '/pages/profile/blocking/geotags?fsid=',
    blocking_posts: '/pages/profile/blocking/posts?fsid=',
    blocking_comments: '/pages/profile/blocking/comments?fsid=',
  };

  let fresnsViewProfilePath = typeMapping[profileDefaultHomepage] || '/pages/profile/posts?fsid=';

  if (fsid) {
    return fresnsViewProfilePath + fsid;
  }

  return fresnsViewProfilePath;
}

// fresnsViewProfileData
async function fresnsViewProfileData(uidOrUsername, key = null) {
  let profileData = cacheGet('fresnsViewProfileData');

  if (!profileData || profileData?.detail?.fsid != uidOrUsername) {
    const result = await fresnsApi.user.detail(uidOrUsername);

    let newProfileData = result.data;

    newProfileData.followersYouKnow = [];

    if (result.code == 0 && fresnsAuth.userLogin) {
      const followerResult = await fresnsApi.user.followersYouKnow(uidOrUsername);

      if (followerResult.code == 0) {
        newProfileData.followersYouKnow = followerResult.data.list;
      }
    }

    // {
    //   "items": {},
    //   "detail": {},
    //   "followersYouKnow": []
    // }

    cachePut('fresnsViewProfileData', newProfileData);

    profileData = newProfileData;
  }

  if (!key) {
    return profileData;
  }

  return dataGet(profileData, key);
}

export const fresnsAuth = new authInfo();
export { fresnsAccount, fresnsUser, fresnsOverview, fresnsViewProfilePath, fresnsViewProfileData };
