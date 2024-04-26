/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from './configs';
import { fresnsClient } from './client';

// 在缓存中存储项目
export async function cachePut(key, data = '', minutes = null, tag = null) {
  if (!data) {
    return;
  }

  if (!minutes) {
    minutes = await fresnsConfig('cache_minutes', 3);
  }

  const now = new Date();
  const expiration = now.setMinutes(now.getMinutes() + minutes);

  wx.setStorageSync(key, {
    langTag: fresnsClient.langTag,
    data: data,
    expiration: expiration,
  });

  if (tag) {
    cacheTag(tag, key);
  }
}

// 从缓存中检索项目
export function cacheGet(key) {
  const cacheData = wx.getStorageSync(key);

  if (!cacheData || cacheData?.langTag != fresnsClient.langTag) {
    return null;
  }

  const expiration = cacheData.expiration;
  const now = new Date();
  const diff = expiration - now.getTime();

  if (diff > 0) {
    return cacheData?.data;
  }

  return null;
}

// 缓存标签
export function cacheTag(tag, key) {
  let cacheKeys = wx.getStorageSync(tag);

  if (cacheKeys) {
    // 如果 tag 数据中没有 key 项，则添加进去
    if (!cacheKeys.includes(key)) {
      cacheKeys.push(key);

      wx.setStorageSync(tag, cacheKeys);
    }
  } else {
    wx.setStorageSync(tag, [key]);
  }
}

// 清除缓存
export function clearCache(tag) {
  let cacheKeys = wx.getStorageSync(tag);

  if (cacheKeys && Array.isArray(cacheKeys)) {
    // 循环遍历每个 key，并删除对应的存储项
    cacheKeys.forEach(key => {
      wx.removeStorageSync(key);
    });

    // 最后，清除存储的 keys 数组本身
    wx.removeStorageSync(tag);
  }
}
