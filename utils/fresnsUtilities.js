/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../api/tool/function';
import { globalInfo } from './fresnsGlobalInfo';

// cache put
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

// cache get
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

// navigateToAccountLogin
export function navigateToAccountLogin() {
    const pages = getCurrentPages();
    const curPage = pages[pages.length - 1];
    if (curPage.route !== 'pages/account/login') {
        wx.redirectTo({
            url: '/pages/account/login',
        });
    }
}

// navigateToUserLogin
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

// strUploadInfo
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

// enJson
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

// truncateText
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

// generateRandomString
export function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}
