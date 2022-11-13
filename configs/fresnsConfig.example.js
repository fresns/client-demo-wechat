/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
module.exports = {
    apiHost: 'https://api.fresns.org',
    platform: 8,
    appId: 'App ID',
    appSecret: 'App Secret',
    callbackUniKey: 'WeChatMp',
    // 如果编辑器未开启定位功能，可以不配置以下腾讯地图信息
    tencentMapKey: '使用在腾讯位置服务申请的 key',
    tencentMapReferer: '调用腾讯位置插件的 app 的名称',
};

/**
 * apiHost: 你的 Fresns 主程序地址
 * platform: 默认为 8，创建密钥时，平台选择 WeChat MiniProgram
 * appId: Fresns 控制台创建的密钥 App ID
 * appSecret: Fresns 控制台创建的密钥 App Secret
 * callbackUniKey: 回调返参 Unikey，与后端使用的插件相关，官方默认为 WeChatMp
 *
 * 腾讯地图信息 https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx76a9a06e5b4e693e&token=&lang=zh_CN
 * 地图 Key 申请 https://lbs.qq.com/console/key.html
 *
 * tencentMapKey: 腾讯地图分配给你的 key
 * tencentMapReferer: 你腾讯地图应用信息中填写的 Key 名称
 *
 * 腾讯地图应用配置需启用 WebServiceAPI，并且域名白名单需填入 servicewechat.com
 */
