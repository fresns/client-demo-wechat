import { request, uploadFile } from '../tool/request'
import appConfig from '../../appConfig'

const editor = {
  /**
   * 撤回审核中草稿
   * @return {wx.RequestTask}
   */
  editorRevoke: () => {
    return request({
      url: '/api/fresns/editor/revoke',
    })
  },
  /**
   * 提交内容正式发表
   * @return {wx.RequestTask}
   */
  editorSubmit: (options) => {
    return request({
      url: '/api/fresns/editor/submit',
      data: {
        ...options,
      },
    })
  },
  /**
   * 快速发表
   * @return {wx.RequestTask}
   */
  editorPublish: () => {
    return request({
      url: '/api/fresns/editor/publish',
    })
  },
  /**
   * 删除草稿或附属文件
   * @return {wx.RequestTask}
   */
  editorDelete: (options) => {
    return request({
      url: '/api/fresns/editor/delete',
      data: {
        ...options,
      },
    })
  },
  /**
   * 更新草稿内容
   * @return {wx.RequestTask}
   */
  editorUpdate: (options) => {
    return request({
      url: '/api/fresns/editor/update',
      data: {
        ...options,
      },
    })
  },
  /**
   * 上传文件
   * @return {wx.RequestTask}
   */
  editorUpload: async (filePath, formData) => {
    return uploadFile(filePath, {
      url: '/api/fresns/editor/upload',
      data: {
        ...formData
      }
    })
  },
  /**
   * 获取上传凭证
   * @return {wx.RequestTask}
   */
  editorUploadToken: () => {
    return request({
      url: '/api/fresns/editor/uploadToken',
    })
  },
  /**
   * 创建新草稿
   * @return {wx.RequestTask}
   */
  editorCreate: (options) => {
    return request({
      url: '/api/fresns/editor/create',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取草稿详情
   * @return {wx.RequestTask}
   */
  editorDetail: () => {
    return request({
      url: '/api/fresns/editor/detail',
    })
  },
  /**
   * 获取草稿列表
   * @return {wx.RequestTask}
   */
  editorLists: (options) => {
    return request({
      url: '/api/fresns/editor/lists',
      data: {
        ...options,
      },
    })
  },
  /**
   * 获取编辑器配置信息
   * @return {wx.RequestTask}
   */
  editorConfigs: (options) => {
    return request({
      url: '/api/fresns/editor/configs',
      data: {
        ...options,
      },
    })
  },
}

module.exports = editor
