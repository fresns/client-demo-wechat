/*!
 * Fresns 微信小程序 (https://fresns.org)
 * Copyright 2021-Present Jarvis Tang
 * Licensed under the Apache-2.0 license
 */
import { callPageFunction } from '../../../util/callPageFunction'

Component({
  properties: {
    // 草稿列表
    drafts: Array,
  },
  data: {},
  lifetimes: {
    attached: async function () {
    },
  },
  methods: {
    handleClickDraft: function (e) {
      const { draft } = e.target.dataset
      callPageFunction("onSelectDraft", draft)
    },
  },
})
