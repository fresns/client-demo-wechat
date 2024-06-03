/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { fresnsApi } from '../../sdk/services/api';
import { fresnsConfig, fresnsLang } from '../../sdk/helpers/configs';

let isRefreshing = false;

Page({
  /** 外部 mixin 引入 **/
  mixins: [
    require('../../mixins/common'),
    require('../../mixins/fresnsCallback'),
    require('../../mixins/fresnsInteraction'),
    require('../../sdk/extensions/functions'),
  ],

  /** 页面的初始数据 **/
  data: {
    title: null,

    // 搜索
    type: '',
    typeName: '用户',
    key: '',

    inputShowed: false,
    inputVal: '',
    isFocus: false,

    // 当前分页数据
    users: [],
    groups: [],
    hashtags: [],
    geotags: [],
    posts: [],
    comments: [],

    // 分页配置
    page: 1, // 下次请求时候的页码，初始值为 1
    isReachBottom: false, // 是否已经无内容（已经最后一次，无内容再加载）
    loadingStatus: false, // loading 组件状态
    loadingTipType: 'none', // loading 组件提示文案
  },

  /** 监听页面加载 **/
  onLoad: async function (options) {
    const searchType = options.type || 'user';
    const searchKey = options.key || '';

    this.setData({
      navbarBackButton: true,
      title: await fresnsConfig('channel_search_name'),
      type: searchType,
      typeName: await fresnsConfig('user_name'),
      key: searchKey,
      fresnsLang: await fresnsLang(),
    });

    if (searchType && searchKey) {
      await this.loadFresnsPageData();
    }
  },

  onSearchType: async function () {
    const itemList = [
      await fresnsConfig('user_name'),
      await fresnsConfig('group_name'),
      await fresnsConfig('hashtag_name'),
      await fresnsConfig('geotag_name'),
      await fresnsConfig('post_name'),
      await fresnsConfig('comment_name'),
    ];
    const type = ['user', 'group', 'hashtag', 'geotag', 'post', 'comment'];

    const self = this;

    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        const tapIndex = res.tapIndex;

        const typeName = itemList[tapIndex];

        self.setData({
          typeName: typeName,
          type: type[tapIndex],

          users: [],
          groups: [],
          hashtags: [],
          geotags: [],
          posts: [],
          comments: [],

          page: 1,
          isReachBottom: false,
          refresherStatus: true,
          loadingStatus: false,
          loadingTipType: 'none',
        });
      },
    });
  },

  showInput() {
    this.setData({
      inputShowed: true,
    });
  },
  blurInput() {
    this.setData({
      isFocus: false,
    });
  },
  hideInput() {
    this.setData({
      inputVal: '',
      inputShowed: false,

      users: [],
      groups: [],
      hashtags: [],
      geotags: [],
      posts: [],
      comments: [],

      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingStatus: false,
      loadingTipType: 'none',
    });
  },
  clearInput() {
    this.setData({
      inputVal: '',

      users: [],
      groups: [],
      hashtags: [],
      geotags: [],
      posts: [],
      comments: [],

      page: 1,
      isReachBottom: false,
      refresherStatus: true,
      loadingStatus: false,
      loadingTipType: 'none',
    });
  },
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value,
      isFocus: true,
    });
  },

  confirmSearch: async function () {
    this.setData({
      key: this.data.inputVal,
    });
    await this.loadFresnsPageData();
  },

  /** 加载列表数据 **/
  loadFresnsPageData: async function () {
    if (this.data.isReachBottom) {
      return;
    }

    this.setData({
      loadingStatus: true,
    });

    const searchType = this.data.type;
    const searchKey = this.data.key;

    console.log('loadFresnsPageData', searchType, searchKey);

    // 搜索代码
    switch (searchType) {
      case 'user':
        const userRes = await fresnsApi.search.users({
          searchKey: searchKey,
          filterType: 'whitelist',
          filterKeys:
            'fsid,uid,username,url,nickname,nicknameColor,avatar,decorate,bioHtml,stats,operations,interaction',
          page: this.data.page,
        });

        if (userRes.code === 0) {
          const { pagination, list } = userRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.users.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            users: this.data.users.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      case 'group':
        const groupRes = await fresnsApi.search.groups({
          searchKey: searchKey,
          filterType: 'blacklist',
          filterKeys: 'archives,operations',
          page: this.data.page,
        });

        if (groupRes.code === 0) {
          const { pagination, list } = groupRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.groups.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            groups: this.data.groups.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      case 'hashtag':
        const hashtagRes = await fresnsApi.search.hashtags({
          searchKey: searchKey,
          filterType: 'whitelist',
          filterKeys:
            'htid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction',
          page: this.data.page,
        });

        if (hashtagRes.code === 0) {
          const { pagination, list } = hashtagRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.hashtags.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            hashtags: this.data.hashtags.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      case 'geotag':
        const geotagRes = await fresnsApi.search.geotags({
          searchKey: searchKey,
          filterType: 'whitelist',
          filterKeys:
            'gtid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction',
          page: this.data.page,
        });

        if (geotagRes.code === 0) {
          const { pagination, list } = geotagRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.geotags.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            geotags: this.data.geotags.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      case 'post':
        const postRes = await fresnsApi.search.posts({
          searchKey: searchKey,
          filterType: 'blacklist',
          filterKeys: 'hashtags,previewLikeUsers',
          filterGeotagType: 'whitelist',
          filterGeotagKeys: 'gtid,name,distance,unit',
          filterAuthorType: 'whitelist',
          filterAuthorKeys:
            'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
          filterPreviewCommentType: 'whitelist',
          filterPreviewCommentKeys: 'cid,content,contentLength,author.nickname,author.avatar,author.status',
          filterReplyToPostType: 'whitelist',
          filterReplyToPostKeys:
            'pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name',
          filterReplyToCommentType: 'whitelist',
          filterReplyToCommentKeys:
            'cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status',
          page: this.data.page,
        });

        if (postRes.code === 0) {
          const { pagination, list } = postRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.posts.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            posts: this.data.posts.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      case 'comment':
        const commentRes = await fresnsApi.search.comments({
          searchKey: searchKey,
          filterType: 'blacklist',
          filterKeys: 'hashtags,previewLikeUsers',
          filterGeotagType: 'whitelist',
          filterGeotagKeys: 'gtid,name,distance,unit',
          filterAuthorType: 'whitelist',
          filterAuthorKeys:
            'fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations',
          filterPreviewCommentType: 'whitelist',
          filterPreviewCommentKeys: 'cid,content,contentLength,author.nickname,author.avatar,author.status',
          filterReplyToPostType: 'whitelist',
          filterReplyToPostKeys:
            'pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name',
          filterReplyToCommentType: 'whitelist',
          filterReplyToCommentKeys:
            'cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status',
          page: this.data.page,
        });

        if (commentRes.code === 0) {
          const { pagination, list } = commentRes.data;
          const isReachBottom = pagination.currentPage === pagination.lastPage;

          const listCount = list.length + this.data.comments.length;

          let tipType = 'none';
          if (isReachBottom) {
            tipType = listCount > 0 ? 'page' : 'empty';
          }

          this.setData({
            comments: this.data.comments.concat(list),
            page: this.data.page + 1,
            loadingTipType: tipType,
            isReachBottom: isReachBottom,
          });
        }
        break;

      default:
        return;
    }

    this.setData({
      loadingStatus: false,
    });
  },

  /** 监听用户上拉触底 **/
  onScrollToLower: async function () {
    if (isRefreshing) {
      console.log('上拉', '防抖');

      return;
    }

    isRefreshing = true;

    await this.loadFresnsPageData();

    setTimeout(() => {
      isRefreshing = false;
    }, 5000); // 防抖时间 5 秒
  },
});
