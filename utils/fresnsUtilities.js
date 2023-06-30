/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../api/tool/function';
import { globalInfo } from './fresnsGlobalInfo';

// 在缓存中存储项目
export async function cachePut(key, data = '', minutes = null) {
  if (!data) {
    return;
  }

  if (!minutes) {
    minutes = (await fresnsConfig('cache_minutes')) || 3;
  }

  const now = new Date();
  const expiresTime = now.setMinutes(now.getMinutes() + minutes);

  wx.setStorageSync(key, {
    langTag: globalInfo.langTag,
    data: data,
    expiresTime: expiresTime,
  });
}

// 从缓存中检索项目
export function cacheGet(key) {
  const cacheData = wx.getStorageSync(key);

  if (!cacheData || cacheData?.langTag != globalInfo.langTag) {
    return null;
  }

  const expiresTime = cacheData.expiresTime;
  const now = new Date();
  const timeLeft = expiresTime - now.getTime();

  if (timeLeft > 0) {
    return cacheData;
  }

  return null;
}

// 未登录，跳转到登录页
export function navigateToAccountLogin() {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1];
  if (curPage.route !== 'pages/account/login') {
    wx.redirectTo({
      url: '/pages/account/login',
    });
  }
}

// 账号登录，未登录用户，跳转到用户选择页
export function navigateToUserLogin() {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1];
  if (curPage.route !== 'pages/account/users') {
    wx.redirectTo({
      url: '/pages/account/users',
    });
  }
}

// parseUrlParams
export function parseUrlParams(urlParams = '') {
  if (!urlParams) {
    return {};
  }
  let paramsObj = {};
  let paramsArr = urlParams.split('&');
  for (let i = 0; i < paramsArr.length; i++) {
    let param = paramsArr[i].split('=');
    paramsObj[param[0]] = param[1];
  }
  return paramsObj;
}

// repPluginUrl
export function repPluginUrl(url = '', params = {}) {
  let updatedUrl = url;

  for (const key in params) {
    const value = params[key];
    const placeholder = `{${key}}`;

    updatedUrl = updatedUrl.replace(placeholder, value);
  }

  return updatedUrl;
}

// 处理上传参数
export function strUploadInfo(usageType = '', tableName = '', tableColumn = '', tableId = '', tableKey = '') {
  const image = {
    usageType: usageType,
    tableName: tableName,
    tableColumn: tableColumn,
    tableId: tableId,
    tableKey: tableKey,
    type: 'image',
  };
  const video = {
    usageType: usageType,
    tableName: tableName,
    tableColumn: tableColumn,
    tableId: tableId,
    tableKey: tableKey,
    type: 'video',
  };
  const audio = {
    usageType: usageType,
    tableName: tableName,
    tableColumn: tableColumn,
    tableId: tableId,
    tableKey: tableKey,
    type: 'audio',
  };
  const document = {
    usageType: usageType,
    tableName: tableName,
    tableColumn: tableColumn,
    tableId: tableId,
    tableKey: tableKey,
    type: 'document',
  };

  const imageStr = JSON.stringify(image).replace(/\n|\r/g, '');
  const imageBase64Encoded = wx.arrayBufferToBase64(imageStr);
  const imageUrlEncoded = encodeURIComponent(imageBase64Encoded);

  const videoStr = JSON.stringify(video).replace(/\n|\r/g, '');
  const videoBase64Encoded = wx.arrayBufferToBase64(videoStr);
  const videoUrlEncoded = encodeURIComponent(videoBase64Encoded);

  const audioStr = JSON.stringify(audio).replace(/\n|\r/g, '');
  const audioBase64Encoded = wx.arrayBufferToBase64(audioStr);
  const audioUrlEncoded = encodeURIComponent(audioBase64Encoded);

  const documentStr = JSON.stringify(document).replace(/\n|\r/g, '');
  const documentBase64Encoded = wx.arrayBufferToBase64(documentStr);
  const documentUrlEncoded = encodeURIComponent(documentBase64Encoded);

  const uploadInfo = {
    image: imageUrlEncoded,
    video: videoUrlEncoded,
    audio: audioUrlEncoded,
    document: documentUrlEncoded,
  };

  return uploadInfo;
}

// 解码参数
export function enJson(encoded) {
  // Step 1: URL 解码
  const decodedURLData = decodeURIComponent(encoded);

  // Step 2: Base64 解码为 ArrayBuffer
  const arrayBuffer = wx.base64ToArrayBuffer(decodedURLData);

  // Step 3: 将 ArrayBuffer 转换为字符串
  const decoder = new TextDecoder('utf-8');
  const jsonString = decoder.decode(arrayBuffer);

  // Step 4: 将字符串转换为 JSON
  const json = JSON.parse(jsonString);

  return json;
}

// 处理 HTML 标签
export function truncateText(text, length) {
  // 过滤掉 HTML 标签和换行符
  const strippedText = text.replace(/(<([^>]+)>)/gi, '').replace(/(\r\n|\n|\r)/gm, '');

  // 截取指定长度的字符串
  const truncatedText = strippedText.substring(0, length);

  // 如果字符串被截断了，加上省略号
  if (strippedText.length > length) {
    return truncatedText + '...';
  }

  return truncatedText;
}

// debounce
export function debounce(fn, delay, ctx) {
  let movement = null;
  return function () {
    let args = arguments;

    // 清空上一次操作
    clearTimeout(movement);

    // delay时间之后，任务执行
    movement = setTimeout(function () {
      fn.apply(ctx, args);
    }, delay);
  };
}

// 随机生成字符串
export function generateRandomString(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// 获取时区 index
export function getTimezoneIndex(utcList, timezone = null) {
  if (!timezone) {
    return 0;
  }

  for (let i = 0; i < utcList.length; i++) {
    if (utcList[i].value === timezone) {
      return i;
    }
  }
  return 0; // 返回 0 或者其他默认索引，当找不到匹配项时
}

// 处理年月日
export function formattedDate(datetime = null) {
  if (datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // padStart 用于补全位数
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // padStart 用于补全位数
  const day = today.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
