/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import './libs/Mixins';
import { globalInfo } from './configs/fresnsGlobalInfo';

const themeListeners = [];

App({
    globalData: {
        theme: 'light', // dark
    },
    async onLaunch(options) {
        await globalInfo.init();
        this.globalData.globalInfo = globalInfo;

        const appBaseInfo = wx.getAppBaseInfo();
        console.log(appBaseInfo);
        this.onThemeChange(appBaseInfo);
    },
    onThemeChange(result) {
        console.log(result);
        this.globalData.theme = result.theme;
        themeListeners.forEach((listener) => {
            listener(result.theme);
        });
    },
    themeChanged(theme) {
        this.onThemeChange({ theme });
    },
    watchThemeChange(listener) {
        if (themeListeners.indexOf(listener) < 0) {
            themeListeners.push(listener);
        }
    },
    unWatchThemeChange(listener) {
        const index = themeListeners.indexOf(listener);
        if (index > -1) {
            themeListeners.splice(index, 1);
        }
    },
});
