/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import Api from '../../api/api'
import { debounce } from '../../util/debounce'
import { callPrevPageFunction } from '../../util/callPrevPageFunction'

const QueryType = {
  User: 1,
  Hashtags: 3,
}

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    inputShowed: false,
    inputVal: '',

    queryType: QueryType.User,
    results: [],
  },
  queryInputTips: null,
  onLoad: async function (options) {
    // 1 用户、3 话题
    const { queryType } = options
    this.setData({
      queryType: +queryType,
    })

    this.queryInputTips = debounce(async function () {
      const queryRes = await Api.info.infoInputTips({
        queryType: this.data.queryType,
        queryKey: this.data.inputVal,
      })
      if (queryRes.code === 0) {
        this.setData({
          results: queryRes.data,
        })
      }
    }, 1000, this)
  },
  onClickResult: async function (e) {
    const { result } = e.target.dataset
    if (type === QueryType.User) {
      callPrevPageFunction('onSelectQueryUser', result)
    }
    if (type === QueryType.Hashtags) {
      callPrevPageFunction('onSelectQueryHashtags', result)
    }
    wx.navigateBack()
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: '',
      inputShowed: false,
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: '',
    })
  },
  inputTyping: function (e) {
    const { value } = e.detail
    this.setData({
      inputVal: value,
    })
    this.queryInputTips()
    return value
  },
})
