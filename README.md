<p align="center"><a href="https://fresns.cn" target="_blank"><img src="https://cdn.fresns.cn/images/logo.png" width="300"></a></p>

<p align="center">
<img src="https://img.shields.io/badge/WeChat-Mini%20Program-blueviolet" alt="WeChat">
<img src="https://img.shields.io/badge/Fresns%20API-2.x-orange" alt="Fresns API">
<img src="https://img.shields.io/badge/License-Apache--2.0-green" alt="License">
</p>

## 介绍

Fresns 是一款免费开源的社交网络服务软件，专为跨平台而打造的通用型社区产品，支持灵活多样的内容形态，可以满足多种运营场景，符合时代潮流，更开放且更易于二次开发。

- [点击了解产品 16 个功能特色](https://docs.fresns.cn/guide/features.html)
- 使用者请阅读[安装教程](https://docs.fresns.cn/guide/install.html)和[运营文档](https://docs.fresns.cn/operating/)；
- 扩展插件开发者请阅读[扩展文档](https://docs.fresns.cn/extensions/)和[数据字典](https://docs.fresns.cn/database/)；
- 客户端开发者（网站端、小程序、App）请阅读 [API 文档](https://docs.fresns.cn/api/)。

## 免责申明

Fresns 是一款支持多语言和跨时区的免费开源软件，研发和生态建设以开源组织方式协作，我们不为任何运营主体提供技术背书，不参与任何项目运营，不承担任何法律责任。由于下载代码即可使用，所以我们无法得知你的用途，但是请在使用时遵守所在国家和地区的法律法规，禁止用于违法违规业务。

## 技术框架

| 框架 | 版本 | 用途 |
| --- | --- | --- |
| [Fresns](https://gitee.com/fresns/fresns) | 2.x | 后端 API |
| [WeUI](https://github.com/Tencent/weui-wxss) | 2.x | 小程序 UI 框架 |
| [mp-html](https://github.com/jin-yufeng/mp-html) | 2.x | 小程序富文本组件 |

## 使用说明

遵循 [Fresns 客户端设计理念](https://docs.fresns.cn/extensions/idea.html#%E5%AE%A2%E6%88%B7%E7%AB%AF)，小程序以结构化方式实现了全部功能，使用者可以根据自己的需求，自定义页面风格、交互体验、栏目命名、入口路径等，实现各自个性化的运营场景。

- 1、下载[代码包](https://gitee.com/fresns/wechat/releases)；
- 2、解压后使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入项目，项目名称和 AppID 填写你的小程序信息；
- 3、将根目录的 `fresns.example.js` 文件名修改为 `fresns.js`，然后根据里面的描述填写你的配置信息；
- 4、修改风格样式，或者使用第三方开发的风格样式覆盖原文件；
- 5、使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)上传代码，提交到微信公众平台。

小程序支持编译成 iOS 和 Android 移动应用，也可以编译成 Web 网页应用，具体方法阅读 [Donut](https://dev.weixin.qq.com/) 教程。

## 加入我们

Fresns 的开源社区正在急速增长中，如果你认可我们的开源软件，有兴趣为 Fresns 的发展做贡献，竭诚欢迎[加入我们](https://docs.fresns.cn/community/join.html)一起开发完善。无论是[报告错误](https://docs.fresns.cn/guide/feedback.html)或是 Pull Request 开发，那怕是修改一个错别字也是对我们莫大的帮助。

贡献指南：[https://docs.fresns.cn/contributing/](https://docs.fresns.cn/contributing/)

## 许可协议

Fresns 是根据 [Apache-2.0](https://opensource.org/licenses/Apache-2.0) 授权的开源软件。
