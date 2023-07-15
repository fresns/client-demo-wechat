/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../fresns';
import { globalInfo } from '../../utils/fresnsGlobalInfo';

const md5 = require('../../libs/md5/md5');
const { base64_encode } = require('../../libs/base64/base64');

/** 生成签名 **/
export async function makeSignature(timestamp) {
  const headers = {
    'X-Fresns-App-Id': appConfig.appId,
    'X-Fresns-Client-Platform-Id': 7, // https://docs.fresns.cn/database/dictionary/platforms.html
    'X-Fresns-Client-Version': globalInfo.clientVersion,
    'X-Fresns-Aid': globalInfo.aid,
    'X-Fresns-Aid-Token': globalInfo.aidToken,
    'X-Fresns-Uid': globalInfo.uid,
    'X-Fresns-Uid-Token': globalInfo.uidToken,
    'X-Fresns-Signature-Timestamp': timestamp,
  };

  const strA = [
    'X-Fresns-App-Id',
    'X-Fresns-Client-Platform-Id',
    'X-Fresns-Client-Version',
    'X-Fresns-Aid',
    'X-Fresns-Aid-Token',
    'X-Fresns-Uid',
    'X-Fresns-Uid-Token',
    'X-Fresns-Signature-Timestamp',
  ]
    .filter((v) => headers[v])
    .sort();

  const stringSignTemp = strA.map((key) => `${key}=${headers[key]}`).join('&') + `&AppSecret=${appConfig.appSecret}`;

  return md5(stringSignTemp);
}

/**
 * 获取请求标头
 * https://docs.fresns.cn/api/headers.html
 */
export async function getHeaders() {
  const now = new Date();
  const timestamp = now.getTime();

  const headers = {
    'X-Fresns-App-Id': appConfig.appId,
    'X-Fresns-Client-Platform-Id': 7, // https://docs.fresns.cn/database/dictionary/platforms.html
    'X-Fresns-Client-Version': globalInfo.clientVersion,
    'X-Fresns-Client-Device-Info': globalInfo.deviceInfo,
    'X-Fresns-Client-Lang-Tag': globalInfo.langTag,
    'X-Fresns-Client-Timezone': null,
    'X-Fresns-Client-Content-Format': null,
    'X-Fresns-Aid': globalInfo.aid,
    'X-Fresns-Aid-Token': globalInfo.aidToken,
    'X-Fresns-Uid': globalInfo.uid,
    'X-Fresns-Uid-Token': globalInfo.uidToken,
    'X-Fresns-Signature': await makeSignature(timestamp),
    'X-Fresns-Signature-Timestamp': timestamp,
  };

  for (const key in headers) {
    if (headers[key] === null) {
      delete headers[key];
    }
  }

  return headers;
}

/**
 * 获取插件鉴权信息
 * https://docs.fresns.cn/extensions/callback/url-authorization.html
 */
export async function getPluginAuthorization() {
  const now = new Date();
  const timestamp = now.getTime();

  const headers = {
    'X-Fresns-App-Id': appConfig.appId,
    'X-Fresns-Client-Platform-Id': 7, // https://docs.fresns.cn/database/dictionary/platforms.html
    'X-Fresns-Client-Version': globalInfo.clientVersion,
    'X-Fresns-Client-Device-Info': globalInfo.deviceInfo,
    'X-Fresns-Client-Lang-Tag': globalInfo.langTag,
    'X-Fresns-Client-Timezone': null,
    'X-Fresns-Client-Content-Format': null,
    'X-Fresns-Aid': globalInfo.aid,
    'X-Fresns-Aid-Token': globalInfo.aidToken,
    'X-Fresns-Uid': globalInfo.uid,
    'X-Fresns-Uid-Token': globalInfo.uidToken,
    'X-Fresns-Signature': await makeSignature(timestamp),
    'X-Fresns-Signature-Timestamp': timestamp,
  };

  for (const key in headers) {
    if (headers[key] === null) {
      delete headers[key];
    }
  }

  const headersStr = JSON.stringify(headers).replace(/\n|\r/g, '');
  const base64Encoded = base64_encode(headersStr);
  const urlEncoded = encodeURIComponent(base64Encoded);

  return urlEncoded;
}
