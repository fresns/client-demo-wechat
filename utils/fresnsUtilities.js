/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../api/tool/function';
import { globalInfo } from './fresnsGlobalInfo';
import { base64_encode } from '../libs/base64/base64';

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
      url: '/pages/account/login?showToast=true',
    });
  }
}

// 账号登录，未登录用户，跳转到用户选择页
export function navigateToUserLogin() {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1];
  if (curPage.route !== 'pages/account/users') {
    wx.redirectTo({
      url: '/pages/account/users?showToast=true',
    });
  }
}

// 获取当前页路径
export function getCurrentPagePath() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];

  return currentPage.route;
}

// 回调主页面
export function callPageFunction(functionName, ...args) {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (!currentPage) return;

  let fun = currentPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(currentPage, args);
  }
}

// 回调上一个页面
export function callPrevPageFunction(functionName, ...args) {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (!prevPage) return;

  let fun = prevPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(prevPage, args);
  }
}

// 回调上一个页面中的组件
export function callPrevPageComponentFunction(componentSelector, functionName, ...args) {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (!prevPage) return;

  const componentInstance = prevPage.selectComponent(componentSelector);
  if (!componentInstance) return;

  let fun = componentInstance[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(componentInstance, args);
  }
}

// 回调指定页面
export function callSpecificPageFunction(route, functionName, ...args) {
  const pages = getCurrentPages();
  const targetPage = pages.find((page) => page.route == route);

  if (!targetPage) return;

  let fun = targetPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(targetPage, args);
  }
}

// 回调指定页面中的组件
export function callSpecificPageComponentFunction(route, componentSelector, functionName, ...args) {
  const pages = getCurrentPages();
  const targetPage = pages.find((page) => page.route == route);

  if (!targetPage) return;

  const componentInstance = targetPage.selectComponent(componentSelector);
  if (!componentInstance) return;

  let fun = componentInstance[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(componentInstance, args);
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

// 替换 URL 变量值
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
  const imageBase64Encoded = base64_encode(imageStr);
  const imageUrlEncoded = encodeURIComponent(imageBase64Encoded);

  const videoStr = JSON.stringify(video).replace(/\n|\r/g, '');
  const videoBase64Encoded = base64_encode(videoStr);
  const videoUrlEncoded = encodeURIComponent(videoBase64Encoded);

  const audioStr = JSON.stringify(audio).replace(/\n|\r/g, '');
  const audioBase64Encoded = base64_encode(audioStr);
  const audioUrlEncoded = encodeURIComponent(audioBase64Encoded);

  const documentStr = JSON.stringify(document).replace(/\n|\r/g, '');
  const documentBase64Encoded = base64_encode(documentStr);
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
function arrayBufferToString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const charArray = Array.from(byteArray).map((byte) => String.fromCharCode(byte));
  return charArray.join('');
}
export function enJson(encoded) {
  // Step 1: URL 解码
  const decodedURLData = decodeURIComponent(encoded);

  // Step 2: Base64 解码为 ArrayBuffer
  const arrayBuffer = wx.base64ToArrayBuffer(decodedURLData);

  // Step 3: 使用上面的函数将 ArrayBuffer 转换为字符串
  const jsonString = arrayBufferToString(arrayBuffer);

  // Step 4: 将字符串转换为 JSON
  const json = JSON.parse(jsonString);

  return json;
}

// 截取和过滤文本内容
export function truncateText(text = '', length, richText = false) {
  if (!text) {
    return text;
  }

  let strippedText = text;

  // 过滤掉 HTML 标签和换行符
  if (!richText) {
    strippedText = text.replace(/(<([^>]+)>)/gi, '').replace(/(\r\n|\n|\r)/gm, '');
  }

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

// 查找树结构小组
export function dfs(tree, gid, newGroup) {
  if (tree.gid === gid) {
    return newGroup;
  }

  if (tree.groups) {
    for (let i = 0; i < tree.groups.length; i++) {
      let result = dfs(tree.groups[i], gid, newGroup);
      if (result !== tree.groups[i]) {
        // 找到了匹配的节点并且已经替换了
        tree.groups[i] = result;
      }
    }
  }

  return tree;
}
