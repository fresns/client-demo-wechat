/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api';
import { globalInfo } from '../../utils/fresnsGlobalInfo';
import { cachePut, cacheGet } from '../../utils/fresnsUtilities';

// fresnsConfig
export const fresnsConfig = async (itemKey = null, defaultValue = null) => {
  let configs = cacheGet('fresnsConfigs');
  let data = configs?.data;

  if (!data) {
    const result = await fresnsApi.global.globalConfigs();
    if (result.code === 0 && result.data) {
      const cacheMinutes = result.data.cache_minutes || 30;

      cachePut('fresnsConfigs', result.data, cacheMinutes);
    }

    data = result.data;
  }

  if (!itemKey) {
    return data;
  }

  return data_get(data, itemKey, defaultValue);
};

// fresnsLang
export const fresnsLang = async (langKey, defaultValue = null) => {
  const langArr = await fresnsConfig('language_pack_contents');

  return data_get(langArr, langKey, defaultValue);
};

// fresnsContentTypes
export const fresnsContentTypes = async (type) => {
  const cacheKey = 'fresnsContentTypes-' + type;

  let contentTypes = cacheGet(cacheKey);

  if (!contentTypes) {
    const result = await fresnsApi.global.globalContentTypes({
      type,
    });

    if (result.code === 0 && result.data) {
      cachePut(cacheKey, result.data, 60);
    }

    contentTypes = result.data;
  }

  return contentTypes;
};

// fresnsCodeMessage
export const fresnsCodeMessage = async (code, defaultValue = null) => {
  let codeMessages = cacheGet('fresnsCodeMessage');

  if (!codeMessages) {
    const result = await fresnsApi.global.globalCodeMessages({
      isAll: 1,
    });

    if (result.code === 0 && result.data) {
      cachePut('fresnsCodeMessage', result.data, 60);
    }

    codeMessages = result.data;
  }

  return data_get(codeMessages, code, defaultValue);
};

// fresnsAccount
export const fresnsAccount = async (key = null) => {
  let fresnsAccount = cacheGet('fresnsAccount');
  let data = fresnsAccount?.data;

  if (!fresnsAccount && globalInfo.accountLogin) {
    const result = await fresnsApi.account.accountDetail();

    if (result.code === 0 && result.data) {
      cachePut('fresnsAccount', result.data);
    }

    data = result.data;
  }

  if (!key) {
    return data;
  }

  return data_get(data, key);
};

// fresnsUser
export const fresnsUser = async (key = null) => {
  let fresnsUser = cacheGet('fresnsUser');
  let data = fresnsUser?.data;

  if (!fresnsUser && globalInfo.userLogin) {
    const result = await fresnsApi.user.userDetail({
      uidOrUsername: globalInfo.uid,
    });

    if (result.code === 0 && result.data) {
      cachePut('fresnsUser', result.data);
    }

    data = result.data;
  }

  if (!key) {
    return data;
  }

  return data_get(data, key);
};

// fresnsUserPanel
export const fresnsUserPanel = async (key = null) => {
  if (!globalInfo.userLogin) {
    return null;
  }

  let fresnsUserPanel = cacheGet('fresnsUserPanel');
  let data = fresnsUserPanel?.data;

  if (!fresnsUserPanel) {
    const result = await fresnsApi.user.userPanel();

    if (result.code === 0 && result.data) {
      cachePut('fresnsUserPanel', result.data, 1);
    }

    data = result.data;
  }

  if (!key) {
    return data;
  }

  return data_get(data, key);
};

// fresnsViewProfile
export const fresnsViewProfile = async (uidOrUsername = null) => {
  if (!uidOrUsername) {
    return null;
  }

  let fresnsViewProfile = cacheGet('fresnsViewProfile');

  if (!fresnsViewProfile || fresnsViewProfile?.fsid != uidOrUsername) {
    console.log('uidOrUsername', uidOrUsername);

    const result = await fresnsApi.user.userDetail({
      uidOrUsername: uidOrUsername,
    });

    if (result.code === 0 && result.data) {
      cachePut('fresnsViewProfile', result.data.detail);
    }

    fresnsViewProfile = result.data.detail;
  }

  return fresnsViewProfile;
};

// data_get
export function data_get(data, key, defaultValue = null) {
  let keys = key.split('.');
  for (let i = 0, n = keys.length; i < n; i++) {
    let k = keys[i];

    if (!data) {
      return defaultValue;
    }

    data = data[k];
  }

  return data || defaultValue;
}
