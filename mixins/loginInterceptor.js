/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { globalInfo } from '../utils/fresnsGlobalInfo';
import { navigateToAccountLogin, navigateToUserLogin } from '../utils/fresnsUtilities';

module.exports = {
  onLoad: function () {
    if (!globalInfo.accountLogin) {
      navigateToAccountLogin();
    }

    if (!globalInfo.userLogin) {
      navigateToUserLogin();
    }
  },
};
