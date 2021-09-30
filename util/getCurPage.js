export function getCurPage() {
  const pages = getCurrentPages()
  console.log(pages[pages.length - 1].route)
  return pages[pages.length - 1]
}
