export function callPageFunction (functionName, ...args) {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (!currentPage) return

  let fun = currentPage[functionName]
  if (fun && typeof fun === 'function') {
    return fun.apply(currentPage, args)
  }
}
