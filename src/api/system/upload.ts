import request from '@/api/http'
import type { ResData } from '@/api/common.types'
import type { ReqUploadFile, ResFileUrl } from './types/upload'
/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (formData: ReqUploadFile): Promise<ResData<ResFileUrl>> => {
  return request.post<ResFileUrl>(`/file/upload/img`, formData, {
    cancel: false
  })
}

// 视频上传
export const uploadVideo = (formData: ReqUploadFile): Promise<ResData<ResFileUrl>> => {
  return request.post<ResFileUrl>(`/file/upload/video`, formData, {
    cancel: false
  })
}
