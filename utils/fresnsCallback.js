/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
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

export function callPrevPageFunction (functionName, ...args) {
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2]
  if (!prevPage) return

  let fun = prevPage[functionName]
  if (fun && typeof fun === 'function') {
    return fun.apply(prevPage, args)
  }
}
