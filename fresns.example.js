/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
module.exports = {
  // 应用密钥创建位置: Fresns 后台 -> 应用中心 -> 应用密钥
  // 密钥平台选「WeChat MiniProgram」，类型选「主程 API」
  apiHost: 'https://discuss.fresns.org', // 你自己站点的地址
  appId: 'App ID',
  appSecret: 'App Secret',
  email: '', // 管理员邮箱，当程序遇到无法使用的时候，可供用户发送反馈邮件
  deactivateWeChatLogin: 0, // 是否停用微信登录功能，停用后只支持账号密码或验证码登录
  mpId: '', // 小程序原始 ID，编译为「多端应用」时使用，仅小程序无需配置
};
