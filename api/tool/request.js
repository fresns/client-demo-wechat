/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import appConfig from '../../fresns';
import { getHeaders } from './helper';

// 常规请求
export function request(options) {
  return new Promise(async (resolve, reject) => {
    const { url, data = {} } = options;

    if (!options.editorUpdate) {
      Object.getOwnPropertyNames(data).forEach((dataKey) => {
        if (data[dataKey] === null || data[dataKey] === undefined || data[dataKey] === '') {
          delete data[dataKey];
        }
      });
    }

    wx.request({
      url: appConfig.apiHost + url,
      data: data,
      header: await getHeaders(),
      method: options.method || 'GET',
      enableHttp2: true,

      // 请求成功
      success: async (res) => {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '[' + res.statusCode + '] 接口请求异常',
            icon: 'none',
            duration: 2000,
          });

          reject(res);

          return;
        }

        if (url == '/status.json') {
          resolve(res.data);

          return;
        }

        const { code, message } = res.data;

        if (code === 0) {
          resolve(res.data);

          return;
        }

        if (code === 31502 || code === 31503 || code === 31504 || code === 31505 || code === 31602 || code === 31603) {
          wx.removeStorageSync('aid');
          wx.removeStorageSync('aidToken');
          wx.removeStorageSync('uid');
          wx.removeStorageSync('uidToken');
          wx.removeStorageSync('fresnsAccount');
          wx.removeStorageSync('fresnsUser');
          wx.removeStorageSync('fresnsUserPanels');
        }

        let signErrorTip = '';
        if (code === 31303) {
          const now = new Date(); // 获取设备本地时间
          const utc8Timestamp = Date.now(); // UTC+8 时区的时间戳（微信固定为东八区时间）
          const utcTimestamp = utc8Timestamp - 8 * 60 * 60 * 1000; // 获取 UTC+0 时区的 Unix 时间戳

          signErrorTip = ' | ' + now + ' | ' + utc8Timestamp + ' | ' + utcTimestamp;
        }

        wx.showToast({
          title: '[' + code + '] ' + message + signErrorTip,
          icon: 'none',
          duration: 2000,
        });

        resolve(res.data);
      },

      // 请求失败
      fail: (res) => {
        wx.showToast({
          title: '[' + res.statusCode + '] 接口请求失败',
          icon: 'none',
          duration: 2000,
        });

        reject(res);
      },
    });
  });
}

// 上传文件请求
export function uploadFile(filePath, options) {
  return new Promise(async (resolve, reject) => {
    const { url, data = {} } = options;

    Object.getOwnPropertyNames(data).forEach((dataKey) => {
      if (data[dataKey] === null || data[dataKey] === undefined || data[dataKey] === '') {
        delete data[dataKey];
      }
    });

    let name = 'file';
    if (url == '/api/v2/editor/post/quick-publish' || url == '/api/v2/editor/comment/quick-publish') {
      name = 'image';
    }

    wx.uploadFile({
      url: appConfig.apiHost + url,
      filePath: filePath,
      name: name,
      header: await getHeaders(),
      formData: data,

      // 请求成功
      success: (res) => {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '[' + res.statusCode + '] 接口请求异常',
            icon: 'none',
            duration: 2000,
          });

          reject(res);

          return;
        }

        let responseData;
        try {
          responseData = JSON.parse(res.data);
        } catch (error) {
          wx.showToast({
            title: '服务器返回的数据无法解析为 JSON',
            icon: 'none',
            duration: 2000,
          });
          reject(error);

          return;
        }

        const { code, message } = responseData;

        if (code !== 0) {
          wx.showToast({
            title: '[' + code + '] ' + message,
            icon: 'none',
            duration: 2000,
          });
        }

        resolve(responseData);
      },

      // 请求失败
      fail: (res) => {
        wx.showToast({
          title: '[' + res.statusCode + '] 接口请求失败',
          icon: 'none',
          duration: 2000,
        });

        reject(res);
      },
    });
  });
}
