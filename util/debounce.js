/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
export function debounce(fn, delay, ctx) {
    let movement = null;
    return function () {
        let args = arguments;

        // 清空上一次操作
        clearTimeout(movement);

        // delay时间之后，任务执行
        movement = setTimeout(function () {
            fn.apply(ctx, args);
        }, delay);
    };
}
