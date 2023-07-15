/**
 * mixins 为 Page 增加 mixin 功能
 * 来源：https://segmentfault.com/a/1190000019527762
 */
const originPage = Page
const originProperties = ['data', 'properties', 'options']
const originMethods = [
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onPageScroll',
  'onTabItemTap',
]

function merge (mixins, options) {
  let targetOptions = {}
  mixins.push(options)
  mixins.forEach((mixin) => {
    if (Object.prototype.toString.call(mixin) !== '[object Object]') {
      throw new Error('mixin 类型必须为对象！')
    }

    for (let [key, value] of Object.entries(mixin)) {
      if (originProperties.includes(key)) {
        targetOptions[key] = { ...value, ...targetOptions[key] }
      } else if (originMethods.includes(key)) {
        const originFunc = targetOptions[key]
        targetOptions[key] = async function (...args) {
          originFunc && await originFunc.call(this, ...args)
          await value.call(this, ...args)
        }
      } else {
        targetOptions = { ...mixin, ...targetOptions }
      }
    }
  })

  return targetOptions
}

Page = (options) => {
  const mixins = options.mixins
  if (Array.isArray(mixins)) {
    delete options.mixins
    options = merge(mixins, options)
  }
  originPage(options)
}
