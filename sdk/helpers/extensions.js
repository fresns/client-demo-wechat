/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { getHeaders } from '../api/tool/header';
import { base64_encode } from '../utilities/base64';

// 生成访问令牌
export async function makeAccessToken() {
  const headers = await getHeaders();

  const headersStr = JSON.stringify(headers).replace(/\n|\r/g, '');
  const base64Encoded = base64_encode(headersStr);
  const urlEncoded = encodeURIComponent(base64Encoded);

  // https://docs.fresns.com/zh-Hans/clients/reference/callback/access-token.html

  return urlEncoded;
}

// 替换 URL 变量值
export function repAppUrl(url = '', params = {}) {
  let updatedUrl = decodeURIComponent(url);

  for (const key in params) {
    const value = params[key];
    const placeholder = `{${key}}`;

    updatedUrl = updatedUrl.replace(placeholder, value);
  }

  return updatedUrl;
}
