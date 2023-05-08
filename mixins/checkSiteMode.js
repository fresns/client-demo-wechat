/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsConfig } from '../api/tool/function';
import { globalInfo } from '../utils/fresnsGlobalInfo';

module.exports = {
  onLoad: async function () {
    try {
      const siteMode = await fresnsConfig('site_mode');
      if (siteMode === 'private' && !globalInfo.userLogin) {
        const pages = getCurrentPages();
        const curPage = pages[pages.length - 1];
        if (curPage.route !== 'pages/portal/private') {
          wx.redirectTo({
            url: '/pages/portal/private',
          });
        }
      }
    } catch (e) {
      console.log('site mode', e);
    }
  },
};
