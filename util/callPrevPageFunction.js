/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
export function callPrevPageFunction(functionName, ...args) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (!prevPage) return;

    let fun = prevPage[functionName];
    if (fun && typeof fun === 'function') {
        return fun.apply(prevPage, args);
    }
}
