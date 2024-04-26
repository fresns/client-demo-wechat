/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */

// 使用「点表示法」从多维数组或对象中根据指定键检索值
export function dataGet(data, key, defaultValue = null) {
  const keys = key.split('.');

  let value = data;
  for (let i = 0, n = keys.length; i < n; i++) {
    let k = keys[i];

    if (value == null || !(k in value)) {
      return defaultValue;
    }

    value = value[k];
  }

  return value == undefined ? defaultValue : value;
}

// 获取当前页面的路由
export function getCurrentPageRoute() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];

  return currentPage.route;
}

// 在组件中回调当前页面的功能
export function callPageFunction(functionName, ...args) {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (!currentPage) return;

  let fun = currentPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(currentPage, args);
  }
}

// 在页面或组件中回调上一个页面的功能
export function callPrevPageFunction(functionName, ...args) {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (!prevPage) return;

  let fun = prevPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(prevPage, args);
  }
}

// 回调指定页面中的功能
export function callSpecificPageFunction(route, functionName, ...args) {
  const pages = getCurrentPages();
  const targetPage = pages.find((page) => page.route == route);

  if (!targetPage) return;

  let fun = targetPage[functionName];
  if (fun && typeof fun === 'function') {
    return fun.apply(targetPage, args);
  }
}

// 回调上一个页面组件中的功能
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

// 回调指定页面组件中的功能
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

// 将 URL Query 参数转换为 Json 对象
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

// 替换树结构里小组信息
export function replaceGroupTreeInfo(tree, gid, newGroup) {
  if (tree.gid === gid) {
    return newGroup;
  }

  if (tree.groups) {
    for (let i = 0; i < tree.groups.length; i++) {
      let result = replaceGroupTreeInfo(tree.groups[i], gid, newGroup);
      if (result !== tree.groups[i]) {
        // 找到了匹配的节点并且已经替换了
        tree.groups[i] = result;
      }
    }
  }

  return tree;
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

// 生成随机字符串
export function generateRandomString(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// 比较两个语义化版本号
export function versionCompare(clientVersion = null, remoteVersion = null) {
  if (!clientVersion || !remoteVersion) {
    return 0;
  }

  const clientVersions = clientVersion.split('.').map(Number);
  const remoteVersions = remoteVersion.split('.').map(Number);

  // '1.0.1', '1.0.3' = -1
  // '1.0.1', '1.0.0' = 1
  // '1.0.1', '1.0.1' = 0

  for (let i = 0; i < clientVersions.length; i++) {
    if (clientVersions[i] > remoteVersions[i]) {
      return 1;
    } else if (clientVersions[i] < remoteVersions[i]) {
      return -1;
    }
  }

  return 0;
}
