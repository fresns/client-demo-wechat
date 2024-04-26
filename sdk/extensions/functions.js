/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
module.exports = {
  handleExtensionTap: async function (e) {
    const navigatorData = e.currentTarget.dataset;

    console.log('handleExtensionTap navigatorData', navigatorData);

    const app = getApp();
    app.globalData.navigatorData = navigatorData;
  },
};
