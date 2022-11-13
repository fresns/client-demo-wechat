/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
export function getCurPage() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
}
