/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
module.exports = {
  // 应用密钥创建位置: Fresns 后台 -> 应用中心 -> 应用密钥
  // 密钥平台选「WeChat MiniProgram」，类型选「主程 API」
  apiHost: 'https://discuss.fresns.cn',
  appId: 'App ID',
  appSecret: 'App Secret',

  // 如果编辑器未开启定位功能，可以不配置以下腾讯地图信息
  tencentMapKey: '使用在腾讯位置服务申请的 key',
  tencentMapReferer: '调用腾讯位置插件的 app 的名称',
}

/**
 * 腾讯地图信息 https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx76a9a06e5b4e693e&token=&lang=zh_CN
 * 地图 Key 申请 https://lbs.qq.com/console/key.html
 *
 * tencentMapKey: 腾讯地图分配给你的 key
 * tencentMapReferer: 你在腾讯地图应用信息中填写的 Key 名称
 *
 * 腾讯地图应用配置需启用 WebServiceAPI，并且域名白名单需填入 servicewechat.com
 */