export function navigateToSignin () {
  const pages = getCurrentPages()
  const curPage = pages[pages.length - 1]
  if (curPage.route !== 'pages/user/signin') {
    wx.navigateTo({
      url: '/pages/user/signin',
    })
  }
}
