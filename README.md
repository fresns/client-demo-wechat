<p align="center"><a href="https://fresns.org/zh-hans/" target="_blank"><img src="https://assets.fresns.com/images/logos/fresns.png" width="300"></a></p>

<p align="center">
<img src="https://img.shields.io/badge/WeChat-Mini%20Program-blueviolet" alt="WeChat">
<img src="https://img.shields.io/badge/Fresns%20API-3.x-orange" alt="Fresns API">
<img src="https://img.shields.io/badge/License-Apache--2.0-green" alt="License">
</p>

## 介绍

Fresns 是一款免费开源的社交网络服务软件，专为跨平台而打造的通用型社区产品，支持灵活多样的内容形态，可以满足多种运营场景，符合时代潮流，更开放且更易于二次开发。

- [点击了解产品 16 个功能特色](https://fresns.org/zh-hans/intro/features.html)
- 使用者请阅读[安装教程](https://fresns.org/zh-hans/guide/install.html)和[运营文档](https://fresns.org/zh-hans/intro/operating.html)
- 扩展插件开发者请阅读[扩展文档](https://docs.fresns.com/zh-hans/open-source/)和[数据字典](https://docs.fresns.com/zh-hans/open-source/database/)
- 客户端开发者（网站端、小程序、App）请阅读 [API 文档](https://docs.fresns.com/zh-hans/clients/api/)

## 产品亮点

- 免费开源，采用 Apache-2.0 开源协议。
- 采用 Skyline 渲染引擎和 glass-easel 组件框架
- 界面文字支持多语言，时间值支持多时区，针对海外用户也能满足需求。
- 支持 Donut 跨端方案，编译成 iOS 和 Android 应用也方便。
- 可应用为社交媒体领域，同样也可以当成 Blog 或 CMS 等其他用途。

![Fresns WeChat](https://assets.fresns.com/images/wikis/previews/WeChat.png)

## 技术框架

本小程序是基于 Fresns API 开发，采用小程序原生语言，纯净干爽，无耦合。二开时使用任何第三方服务或样式库时不用担心兼容和冲突问题，因为我没有在代码里使用和绑定任何其他元素，二开更方便。

| 框架 | 版本 | 用途 |
| --- | --- | --- |
| [Fresns](https://github.com/fresns/fresns) | 3.x | 后端 API |
| [WeUI](https://github.com/Tencent/weui-wxss) | 2.x | 小程序 UI 框架 |

## 使用说明

遵循 [Fresns 客户端设计理念](https://docs.fresns.com/zh-hans/clients/guide/idea.html#%E5%AE%A2%E6%88%B7%E7%AB%AF)，小程序以结构化方式实现了全部功能，使用者可以根据自己的需求，自定义页面风格、交互体验、栏目命名、入口路径等，实现各自个性化的运营场景。

- 1、下载[代码包](https://github.com/fresns/client-demo-wechat/releases)；
- 2、解压后使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入项目，项目名称和 AppID 填写你的小程序信息；
- 3、从 `/sdk/` 文件夹复制 `env.example.js` 文件到根目录，并重命名为 `env.js`，然后根据里面的描述填写你的配置信息（[公共密钥](https://docs.fresns.com/zh-hans/clients/sdk/#%E5%85%AC%E5%85%B1%E5%AF%86%E9%92%A5)）；
- 4、将你的 `apiHost` 录入到微信配置：公众平台->开发->开发管理->开发设置
    - 服务器域名 `request合法域名` 和 `uploadFile合法域名`
    - 业务域名
- 5、配置基础库最低可用版本
    - 公众平台->设置->基本设置->版本设置->基础库最低可用版本
    - 最低可用版本 `3.1.0`
- 6、申请位置信息接口
    - 如果你不需要该功能，忽略下方开通描述，并删除 `app.json` 配置文件中 `"requiredPrivateInfos": ["chooseLocation"]`
    - 公众平台->开发->开发管理->接口设置
    - 申请开通 `wx.chooseLocation` 打开地图选择位置
    - 申请时，可使用编辑器页面截图作为使用场景
- 7、自定义开发
    - 修改风格样式，或者使用第三方开发的风格样式覆盖原文件
    - 导航栏位置 `components/commons/tabbar/`
    - 回调处理 `mixins/fresnsCallback.js`
    - 私有模式处理 `mixins/common.js` `this.checkFresnsSiteMode();`
- 8、使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)上传代码，提交到微信公众平台。

小程序支持编译成 iOS 和 Android 移动应用，也可以编译成 Web 网页应用，具体方法阅读 [Donut](https://dev.weixin.qq.com/) 教程。

## 备注说明

- 本小程序是为**开发者**准备的，所以 TabBar 平铺了所有功能，开发者定制 UI 时自行新增或删减。
- 为了纯净干爽，UI 只使用了微信原生样式组件，二开时，可以替换使用其他样式库，比如使用 TDesign 等。
- 本小程序的开发指南 [https://docs.fresns.com/zh-hans/clients/sdk/wechat/](https://docs.fresns.com/zh-hans/clients/sdk/wechat/)
- 基于本小程序定制开发的案例: [https://github.com/jevantang/zhijie-app](https://github.com/jevantang/zhijie-app)

## 小程序隐私保护指引

- 选中的照片或视频信息：用于`发表附带图片或视频的内容`
- 选中的文件：用于`发表附带文件的内容`
- 选择的位置信息：用于`发表附带位置信息的内容` （未启用 chooseLocation 功能则无需选择该隐私功能）
- 发布内容：用于`发表帖子和评论`
- 剪切板：用于`复制分享链接和帖子内容中的超链接`
- 设备信息：用于`记录互动和错误问题的日志`

## 加入我们

Fresns 的开源社区正在急速增长中，如果你认可我们的开源软件，有兴趣为 Fresns 的发展做贡献，竭诚欢迎[加入我们](https://fresns.org/zh-hans/community/join.html)一起开发完善。无论是[报告错误](https://fresns.org/zh-hans/guide/feedback.html)或是 Pull Request 开发，那怕是修改一个错别字也是对我们莫大的帮助。

贡献指南：[https://fresns.org/contributing/](https://fresns.org/zh-hans/contributing/)

## 许可协议

Fresns 是根据 [Apache-2.0](https://opensource.org/licenses/Apache-2.0) 授权的开源软件。
