/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
export function callPageFunction (functionName, ...args) {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (!currentPage) return

  let fun = currentPage[functionName]
  if (fun && typeof fun === 'function') {
    return fun.apply(currentPage, args)
  }
}
