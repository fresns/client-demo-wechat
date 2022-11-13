/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
export function navigateToSignin() {
    const pages = getCurrentPages();
    const curPage = pages[pages.length - 1];
    if (curPage.route !== 'pages/account/login') {
        wx.navigateTo({
            url: '/pages/account/login',
        });
    }
}
