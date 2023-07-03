/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
import { getPluginAuthorization } from '../api/tool/helper';
import { repPluginUrl } from '../utils/fresnsUtilities';

const app = getApp();

module.exports = {
  fresnsExtensions: async function(e) {
    console.log('fresnsExtensions', e);

    const type = e.currentTarget.dataset.type || '';
    const scene = e.currentTarget.dataset.scene || '';
    const postMessageKey = e.currentTarget.dataset.postMessageKey || '';
    const callbackUlid = e.currentTarget.dataset.callbackUlid || '';
    const aid = e.currentTarget.dataset.aid || '';
    const uid = e.currentTarget.dataset.uid || '';
    const rid = e.currentTarget.dataset.rid || '';
    const gid = e.currentTarget.dataset.gid || '';
    const pid = e.currentTarget.dataset.pid || '';
    const cid = e.currentTarget.dataset.cid || '';
    const fid = e.currentTarget.dataset.fid || '';
    const eid = e.currentTarget.dataset.eid || '';
    const plid = e.currentTarget.dataset.plid || '';
    const clid = e.currentTarget.dataset.clid || '';
    const connectPlatformId = e.currentTarget.dataset.connectPlatformId || '';
    const uploadInfo = e.currentTarget.dataset.uploadInfo || '';
    const locationInfo = e.currentTarget.dataset.locationInfo || '';

    const url = e.currentTarget.dataset.url;
    const title = e.currentTarget.dataset.title;

    // callback variables
    const urlParams = {
      authorization: await getPluginAuthorization(),
      type: type,
      scene: scene,
      postMessageKey: postMessageKey,
      callbackUlid: callbackUlid,
      aid: aid,
      uid: uid,
      rid: rid,
      gid: gid,
      pid: pid,
      cid: cid,
      fid: fid,
      eid: eid,
      plid: plid,
      clid: clid,
      connectPlatformId: connectPlatformId,
      uploadInfo: uploadInfo,
      locationInfo: locationInfo,
    };

    const newUrl = repPluginUrl(url, urlParams);

    console.log('fresnsExtensions', newUrl);

    app.globalData.extensionsUrl = newUrl;
    app.globalData.extensionsTitle = title;
  },
};
