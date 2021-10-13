/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { getConfigItemValue } from '../../api/tool/replace-key'

Page({
  mixins: [
    require('../../mixin/themeChanged'),
  ],
  data: {
    tabs: ["帖子草稿", "评论草稿"],
    activeIndex: 0,
    FileGallery: false,
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
});