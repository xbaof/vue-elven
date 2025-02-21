import request from '@/utils/request'

export interface ResFileUrl {
  fileUrl: string
}
/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return request.post<ResFileUrl>(`/file/upload/img`, params, { cancel: false })
}

// 视频上传
export const uploadVideo = (params: FormData) => {
  return request.post<ResFileUrl>(`/file/upload/video`, params, { cancel: false })
}
