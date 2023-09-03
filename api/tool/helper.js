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
export async function makeSignature(utcTimestamp) {
  const headers = {
    'X-Fresns-App-Id': appConfig.appId,
    'X-Fresns-Client-Platform-Id': 7, // https://docs.fresns.cn/database/dictionary/platforms.html
    'X-Fresns-Client-Version': globalInfo.clientVersion,
    'X-Fresns-Aid': globalInfo.aid,
    'X-Fresns-Aid-Token': globalInfo.aidToken,
    'X-Fresns-Uid': globalInfo.uid,
    'X-Fresns-Uid-Token': globalInfo.uidToken,
    'X-Fresns-Signature-Timestamp': utcTimestamp,
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
  const now = new Date(); // 获取设备本地时间

  const timezoneOffsetInHours = now.getTimezoneOffset() / -60; // 获取时区偏移的小时数
  const utcTimezone = (timezoneOffsetInHours > 0 ? '+' : '') + timezoneOffsetInHours.toString(); // 获取 UTC 时区

  // 是否为夏令时
  function isDST() {
    const january = new Date(new Date().getFullYear(), 0, 1);
    const july = new Date(new Date().getFullYear(), 6, 1);

    return january.getTimezoneOffset() !== july.getTimezoneOffset();
  }

  let timeDiff = now.getTimezoneOffset() * 60 * 1000; // 获取时区偏移的毫秒数
  if (isDST()) {
    timeDiff += 60 * 60 * 1000; // 夏令时增加一个小时
  }

  const utcPositiveOffset = Math.floor(Date.now() + timeDiff); // 东区
  const utcNegativeOffset = Math.floor(Date.now() - timeDiff); // 西区
  let utcTimestamp = timezoneOffsetInHours > 0 ? utcPositiveOffset : utcNegativeOffset; // 获取 UTC+0 的 Unix 时间戳（毫秒级）
  if (timezoneOffsetInHours == 0) {
    utcTimestamp = Math.floor(Date.now() - 28800000); // 如果当前设备是 UTC+0 时区，微信写死了输出为东八区时间了
  }

  const headers = {
    'X-Fresns-App-Id': appConfig.appId,
    'X-Fresns-Client-Platform-Id': 7, // https://docs.fresns.cn/database/dictionary/platforms.html
    'X-Fresns-Client-Version': globalInfo.clientVersion,
    'X-Fresns-Client-Device-Info': globalInfo.deviceInfo,
    'X-Fresns-Client-Timezone': utcTimezone,
    'X-Fresns-Client-Lang-Tag': globalInfo.langTag,
    'X-Fresns-Client-Content-Format': null,
    'X-Fresns-Aid': globalInfo.aid,
    'X-Fresns-Aid-Token': globalInfo.aidToken,
    'X-Fresns-Uid': globalInfo.uid,
    'X-Fresns-Uid-Token': globalInfo.uidToken,
    'X-Fresns-Signature': await makeSignature(utcTimestamp),
    'X-Fresns-Signature-Timestamp': utcTimestamp,
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
  const headers = await getHeaders();

  const headersStr = JSON.stringify(headers).replace(/\n|\r/g, '');
  const base64Encoded = base64_encode(headersStr);
  const urlEncoded = encodeURIComponent(base64Encoded);

  return urlEncoded;
}
