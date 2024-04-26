/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { request } from '../tool/request';

/**
 * 生成分享海报
 * https://marketplace.fresns.cn/open-source/detail/SharePoster
 */

const sharePoster = {
  // 生成分享海报
  generate: (options = {}) => {
    return request({
      path: '/api/share-poster/generate',
      method: 'GET',
      data: {
        ...options,
      },
    });
  },
};

export default sharePoster;
