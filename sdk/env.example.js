/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
module.exports = {
  // App ID 和 App Key 创建位置: Fresns 后台 -> 客户端 -> 应用密钥
  // 密钥平台选「Mini Program」，类型选「主程 API」

  apiHost: 'https://discuss.fresns.org', // 你自己站点的地址

  spaceId: '', // Fresns Space ID 没有则留空
  appId: 'App ID',
  appKey: 'App Key',

  // 开启 true 停用 false
  enableApiQuic: false, // API 是否启用 Quic
  enableWeChatLogin: true, // 是否启用微信登录，需安装插件 https://marketplace.fresns.cn/open-source/detail/WeChatLogin
  enableWeChatAutoLogin: false, // 是否启用微信自动登录

  clientPlatformId: 11, // 客户端平台编号 https://docs.fresns.com/zh-Hans/clients/reference/dictionary/platforms.html
  clientVersion: '1.0.0', // 客户端版本
  email: '', // 管理员邮箱，当程序遇到无法使用的时候，可供用户发送反馈邮件
};
