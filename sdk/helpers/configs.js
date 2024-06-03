/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../services/api';
import { cachePut, cacheGet } from './cache';
import { dataGet } from '../utilities/toolkit';

// fresnsConfig
async function fresnsConfig(itemKey = null, defaultValue = null) {
  let configData = cacheGet('fresnsConfigs');

  if (!configData) {
    const result = await fresnsApi.global.configs();

    if (result.code == 0) {
      const cacheMinutes = result.data.cache_minutes || 10;

      cachePut('fresnsConfigs', result.data, cacheMinutes);
      configData = result.data;
    }
  }

  if (!itemKey) {
    return configData;
  }

  return dataGet(configData, itemKey, defaultValue);
}

// fresnsLang
async function fresnsLang(langKey = null, defaultValue = null) {
  let languagePack = cacheGet('fresnsLanguagePack');

  if (!languagePack) {
    const result = await fresnsApi.global.languagePack();

    if (result.code == 0) {
      cachePut('fresnsLanguagePack', result.data);
      languagePack = result.data;
    }
  }

  if (!langKey) {
    return languagePack;
  }

  return dataGet(languagePack, langKey, defaultValue);
}

// fresnsChannels
async function fresnsChannels() {
  let channels = cacheGet('fresnsChannels');

  if (!channels) {
    const result = await fresnsApi.global.channels();

    if (result.code == 0) {
      cachePut('fresnsChannels', result.data);
      channels = result.data;
    }
  }

  return channels;
}

// fresnsContentTypes
async function fresnsContentTypes(type) {
  if (type != 'post' || type != 'comment') {
    return [];
  }

  let cacheKey = 'fresnsContentTypes_' + type;

  let contentTypes = cacheGet(cacheKey);

  if (!contentTypes) {
    const result = await fresnsApi.global.contentTypes(type);

    if (result.code == 0) {
      cachePut(cacheKey, result.data);
      contentTypes = result.data;
    }
  }

  return contentTypes;
}

// fresnsEditor
const fresnsEditor = {
  // post
  async post(key = null) {
    let configData = cacheGet('fresnsEditorPost');

    if (!configData) {
      const result = await fresnsApi.editor.configs('post');

      if (result.code == 0) {
        cachePut('fresnsEditorPost', result.data);
        configData = result.data;
      }
    }

    if (!key) {
      return configData;
    }

    return dataGet(configData, key);
  },

  // comment
  async comment(key = null) {
    let configData = cacheGet('fresnsEditorComment');

    if (!configData) {
      const result = await fresnsApi.editor.configs('comment');

      if (result.code == 0) {
        cachePut('fresnsEditorComment', result.data);
        configData = result.data;
      }
    }

    if (!key) {
      return configData;
    }

    return dataGet(configData, key);
  },

  // stickers
  async stickers() {
    let stickers = cacheGet('fresnsEditorStickers');

    if (!stickers) {
      const result = await fresnsApi.global.stickers();

      if (result.code == 0) {
        cachePut('fresnsEditorStickers', result.data);
        stickers = result.data;
      }
    }

    return stickers;
  },
};

// fresnsSticky
const fresnsSticky = {
  // posts
  async posts(gid = null) {
    let cacheKey = 'fresnsStickyPosts';
    let stickyState = 3;
    if (gid) {
      cacheKey = 'fresnsStickyPosts_group_' + gid;
      stickyState = 2;
    }

    let stickyPosts = cacheGet(cacheKey);

    if (!stickyPosts) {
      const result = await fresnsApi.post.list({
        stickyState: stickyState,
      });

      if (result.code == 0) {
        cachePut(cacheKey, result.data, 10, 'fresnsCacheTags');
        stickyPosts = result.data;
      }
    }

    return stickyPosts;
  },

  // comments
  async comments(pid) {
    let cacheKey = 'fresnsStickyComments_' + pid;

    let stickyComments = cacheGet(cacheKey);

    if (!stickyComments) {
      const result = await fresnsApi.comment.list({
        pid: pid,
        sticky: 1,
      });

      if (result.code == 0) {
        cachePut(cacheKey, result.data, 10, 'fresnsCacheTags');
        stickyComments = result.data;
      }
    }

    return stickyComments;
  },
};

export { fresnsConfig, fresnsLang, fresnsChannels, fresnsContentTypes, fresnsEditor, fresnsSticky };
