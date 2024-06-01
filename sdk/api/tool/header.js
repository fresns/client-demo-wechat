/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import envConfig from '../../../env';
import { fresnsClient } from '../../helpers/client';
import { fresnsAuth } from '../../helpers/profiles';
import { hash_sha256 } from '../../utilities/sha256';

/**
 * 获取请求标头
 * https://docs.fresns.com/zh-Hans/clients/reference/headers.html
 */
export async function getHeaders() {
  const now = new Date(); // 获取设备本地时间
  const timezoneOffsetInHours = now.getTimezoneOffset() / -60; // 获取时区偏移的小时数
  const utcTimezone = (timezoneOffsetInHours > 0 ? '+' : '') + timezoneOffsetInHours.toString(); // 获取 UTC 时区

  const signTimestamp = String(Date.now()); // 获取 UTC+0 时区的 Unix 时间戳

  const headers = {
    Accept: 'application/json',
    'X-Fresns-Space-Id': envConfig.spaceId,
    'X-Fresns-App-Id': envConfig.appId,
    'X-Fresns-Client-Platform-Id': fresnsClient.platformId,
    'X-Fresns-Client-Version': fresnsClient.version,
    'X-Fresns-Client-Device-Info': fresnsClient.deviceInfo,
    'X-Fresns-Client-Timezone': utcTimezone,
    'X-Fresns-Client-Lang-Tag': fresnsClient.langTag,
    'X-Fresns-Client-Content-Format': null,
    'X-Fresns-Aid': fresnsAuth.aid,
    'X-Fresns-Aid-Token': fresnsAuth.aidToken,
    'X-Fresns-Uid': fresnsAuth.uid,
    'X-Fresns-Uid-Token': fresnsAuth.uidToken,
    'X-Fresns-Signature': await makeSignature(signTimestamp),
    'X-Fresns-Signature-Timestamp': signTimestamp,
  };

  for (const key in headers) {
    if (headers[key] === null) {
      delete headers[key];
    }
  }

  return headers;
}

/** 生成签名 **/
export async function makeSignature(signTimestamp) {
  const headers = {
    'X-Fresns-Space-Id': envConfig.spaceId,
    'X-Fresns-App-Id': envConfig.appId,
    'X-Fresns-Client-Platform-Id': fresnsClient.platformId,
    'X-Fresns-Client-Version': fresnsClient.version,
    'X-Fresns-Aid': fresnsAuth.aid,
    'X-Fresns-Aid-Token': fresnsAuth.aidToken,
    'X-Fresns-Uid': fresnsAuth.uid,
    'X-Fresns-Uid-Token': fresnsAuth.uidToken,
    'X-Fresns-Signature-Timestamp': signTimestamp,
  };

  const strA = [
    'X-Fresns-Space-Id',
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

  const stringSignTemp = strA.map((key) => `${key}=${headers[key]}`).join('&') + `&AppKey=${envConfig.appKey}`;

  const signature = hash_sha256(stringSignTemp);

  return signature;
}
