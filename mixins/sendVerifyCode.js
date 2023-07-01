/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../api/api';
import { fresnsLang } from '../api/tool/function';

module.exports = {
  data: {
    isSendWaiting: false,
    waitingRemainSeconds: 60,
  },

  onLoad: async function () {
    const fresnsSendConfig = wx.getStorageSync('fresnsSendConfig');

    // 判断是否倒计时发送验证码按钮
    if (fresnsSendConfig.sendWaiting) {
      const expiresTime = fresnsSendConfig.expiresTime || 0;

      const currentTime = new Date().getTime();  // 获取当前时间戳（毫秒数）
      const timeDifference = expiresTime - currentTime;  // 毫秒数差值
      const secondsDifference = Math.round(timeDifference / 1000);  // 转换为秒，四舍五入到最接近的整数

      console.log('fresnsSendConfig', 'secondsDifference', secondsDifference);

      if (secondsDifference > 0) {
        // 需要倒计时
        this.setData({
          isSendWaiting: true,
          waitingRemainSeconds: secondsDifference,
        });

        // 倒计时
        const interval = setInterval(() => {
          const nowSeconds = this.data.waitingRemainSeconds - 1;

          console.log('nowSeconds', nowSeconds);

          this.setData({
            isSendWaiting: nowSeconds > 0,
            waitingRemainSeconds: nowSeconds,
          });

          if (nowSeconds <= 0) {
            clearInterval(interval);

            wx.setStorageSync('fresnsSendConfig', {
              sendWaiting: false,
              expiresTime: null,
            });
          }
        }, 1000);

        return;
      }

      // 倒计时结束，初始化
      console.log('fresnsSendConfig', '初始化');
      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: false,
        expiresTime: null,
      });
    }

    // 结束
  },

  // https://docs.fresns.cn/api/common/send-verify-code.html
  fresnsSend: async function (type, useType, templateId, account = null, countryCode = null) {
    const fresnsSendConfig = wx.getStorageSync('fresnsSendConfig');

    // 判断是否有倒计时
    if (fresnsSendConfig.sendWaiting) {
      const expiresTime = fresnsSendConfig.expiresTime || 0;

      const currentTime = new Date().getTime();  // 获取当前时间戳（毫秒数）
      const timeDifference = expiresTime - currentTime;  // 毫秒数差值
      const secondsDifference = Math.round(timeDifference / 1000);  // 转换为秒，四舍五入到最接近的整数

      // 正在倒计时
      if (secondsDifference > 0) {
        wx.showToast({
          title: (await fresnsLang('errorUnavailable')) + ': ' + secondsDifference + ' ' + (await fresnsLang('unitSecond')),
          icon: 'none',
        });

        return;
      }
    }

    // 没有倒计时，处理发送
    let accountName = await fresnsLang('email'); // 邮箱
    if (type == 'sms') {
      accountName = await fresnsLang('phone'); // 手机号
    }

    const emptyAccountTip = accountName + ': ' + (await fresnsLang('errorEmpty')); // 邮箱: 不能为空 or 手机号: 不能为空

    if (!account && useType != 4) {
      wx.showToast({
        title: emptyAccountTip,
        icon: 'none',
      });

      // 倒计时存储在缓存里，保证刷新页面不影响倒计时
      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: false,
        expiresTime: null,
      });

      return;
    }

    if (type == 'sms' && !countryCode) {
      wx.showToast({
        title: (await fresnsLang('countryCode')) + ': ' + (await fresnsLang('errorEmpty')), // 国际区号: 不能为空
        icon: 'none',
      });

      // 倒计时存储在缓存里，保证刷新页面不影响倒计时
      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: false,
        expiresTime: null,
      });

      return;
    }

    const params = {
      type: type,
      useType: useType,
      templateId: templateId,
      account: account,
      countryCode: countryCode,
    };

    const sendCodeRes = await fresnsApi.common.commonSendVerifyCode(params);

    console.log('sendCodeRes', sendCodeRes);

    if (sendCodeRes.code === 0) {
      // 倒计时存储在缓存里，保证刷新页面不影响倒计时
      const now = new Date();
      const expiresTime = now.setSeconds(now.getSeconds() + 60); // 60 秒后失效

      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: true,
        expiresTime: expiresTime,
      });

      wx.showToast({
        title: (await fresnsLang('send')) + ': ' + (await fresnsLang('success')), // 发送: 成功
        icon: 'none',
      });
    }

    // 判断是否倒计时发送验证码按钮
    const checkSendConfig = wx.getStorageSync('fresnsSendConfig');
    if (checkSendConfig.sendWaiting) {
      const newExpiresTime = checkSendConfig.expiresTime || 0;

      const newCurrentTime = new Date().getTime();  // 获取当前时间戳（毫秒数）
      const newTimeDifference = newExpiresTime - newCurrentTime;  // 毫秒数差值
      const newSecondsDifference = Math.round(newTimeDifference / 1000);  // 转换为秒，四舍五入到最接近的整数

      console.log('fresnsSendConfig', 'checkSendConfig', newSecondsDifference);

      if (newSecondsDifference > 0) {
        // 需要倒计时
        this.setData({
          isSendWaiting: true,
          waitingRemainSeconds: newSecondsDifference,
        });

        // 倒计时
        const interval = setInterval(() => {
          const newNowSeconds = this.data.waitingRemainSeconds - 1;

          this.setData({
            isSendWaiting: newNowSeconds > 0,
            waitingRemainSeconds: newNowSeconds,
          });

          if (newNowSeconds <= 0) {
            clearInterval(interval);

            wx.setStorageSync('fresnsSendConfig', {
              sendWaiting: false,
              expiresTime: null,
            });
          }
        }, 1000);

        return;
      }

      // 倒计时结束，初始化
      console.log('fresnsSendConfig', '初始化');
      wx.setStorageSync('fresnsSendConfig', {
        sendWaiting: false,
        expiresTime: null,
      });
    }

    // 结束
  },
};
