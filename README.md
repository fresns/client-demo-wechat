# Fresns 微信小程序

## 全局功能说明

- 全局根据用户微信设备的深色模式情况判断是否自动开启深色模式。
- 全局可展示以下接口参数，每个页面都可以调用这四个接口返回的参数。
    - /api/fresns/info/configs
    - /api/fresns/info/overview
    - /api/fresns/user/detail
    - /api/fresns/member/detail
- 配置信息 /api/fresns/info/configs 可用微信的数据预拉取，提前拉取存储。
    - https://developers.weixin.qq.com/miniprogram/dev/framework/ability/pre-fetch.html
- 成员、小组、话题、帖子、评论，三个内容的列表和详情页，都可以进行“点赞”、“关注”、“屏蔽”三项操作。
- 全局判断站点模式，通过接口 `/api/fresns/info/configs` 获取，参数名 `site_mode`
    - 公开模式，键值为 `public`，所有页面都可以浏览，涉及用户操作的，提示用户登录。
    - 私有模式，键值为 `private`，所有页面都必须登录，并且用户需有权，未登录跳到登录页，已登录但无权，则跳到提示页。
- 支持成员身份切换，相当于重新登录另一个成员身份。系统是单用户多成员机制，所有互动操作都是以成员身份进行的，用户登录后可以切换任意成员。

## 页面功能说明

### 门户页面

- pages/portal/index
    - 接口：`/api/fresns/info/configs`
    - 传参：参数 itemKey 传配置键名 `portal_8`
    - 将获取的内容，解析成 wxml 格式显示出来。

### 列表页

- 参见网站端：[https://fresns.cn/prototype/theme/](https://fresns.cn/prototype/theme/)
- 判断 `wechatadmin_videos` 键值，当为 `false` 时，帖子和评论列表附属文件如果是视频文件，则显示为提示内容（小程序已关闭视频功能）。

### 详情页

- 成员
    - `pages/profile/index?mname={{mname}}`
    - `pages/profile/index?mid={{mid}}`
    - 支持 mname 或 mid 值为请求路径，二选一。
    - 首页默认列表取决于配置表 `it_home_list` 键名键值。
- 小组
    - pages/groups/detail?gid={{gid}}
    - pages/groups/list?type=2&parentGid={{gid}}
- 话题
    - pages/hashtags/detail?huri={{huri}}
- 帖子
    - pages/posts/detail?pid={{pid}}
    - pages/posts/position?pid={{pid}}
- 评论
    - pages/comments/detail?cid={{cid}}

### 编辑器

- 编辑器逻辑流程：[https://fresns.cn/extensions/editor.html](https://fresns.cn/extensions/editor.html)
- 添加位置功能，使用腾讯地图插件 [https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker](https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker)
- map_id = 5