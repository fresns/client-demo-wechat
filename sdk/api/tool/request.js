/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import envConfig from '../../../env';
import { getHeaders } from './header';
import { clearCache } from '../../helpers/cache';
import { isEmpty } from '../../utilities/toolkit';

// 常规请求
export function request(params) {
  return new Promise(async (resolve, reject) => {
    const { path, method, data = {}, draftUpdate } = params;

    // 不是更新草稿接口
    if (!draftUpdate) {
      // 删除空的健值对
      Object.getOwnPropertyNames(data).forEach((key) => {
        if (isEmpty(data[key])) {
          delete data[key];
        }
      });
    }

    wx.request({
      url: envConfig.apiHost + path,
      data: data,
      header: await getHeaders(),
      method: method || 'GET',
      enableHttp2: true,
      enableQuic: envConfig.enableApiQuic || false,

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

        if (path == '/status.json') {
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
          wx.removeStorageSync('fresnsAccountData');
          wx.removeStorageSync('fresnsUserData');
          clearCache('fresnsCacheOverviewTags');
        }

        if (code === 31303) {
          const now = new Date(); // 获取设备本地时间
          const utc8Timestamp = Date.now(); // UTC+8 时区的时间戳（微信固定为东八区时间）
          const utcTimestamp = utc8Timestamp - 8 * 60 * 60 * 1000; // 获取 UTC+0 时区的 Unix 时间戳

          wx.showModal({
            title: '[' + code + '] ' + message,
            content: now + ' | ' + utc8Timestamp + ' | ' + utcTimestamp,
            confirmText: envConfig?.email ? '问题反馈: ' + envConfig?.email : '',
            success(res) {
              if (res.confirm) {
                if (envConfig?.email) {
                  wx.showToast({
                    title: '复制邮箱成功',
                  });
                }
              }
            },
          });
        }

        wx.showToast({
          title: '[' + code + '] ' + message,
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
export function uploadFile(params) {
  return new Promise(async (resolve, reject) => {
    const { path, method, data } = params;

    // 删除空的健值对
    Object.getOwnPropertyNames(data).forEach((key) => {
      if (isEmpty(data[key])) {
        delete data[key];
      }
    });

    let fileKey = 'file';
    let filePath = data.file;
    if (path == '/api/fresns/v1/editor/post/publish' || path == '/api/fresns/v1/editor/comment/publish') {
      fileKey = 'image';
      filePath = data.image;
    }

    wx.uploadFile({
      url: envConfig.apiHost + path,
      name: fileKey,
      filePath: filePath,
      header: await getHeaders(),
      formData: data,
      enableHttp2: true,

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
