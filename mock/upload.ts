export default [
  {
    url: '/file/upload/img',
    method: 'post',
    response: (request) => {
      const token = request.headers.authorization
      if (!token) {
        return { code: 401, msg: '认证失败,请重新登陆！', success: false }
      }
      return {
        code: 200,
        msg: '上传成功!',
        success: true,
        data: { fileUrl: '' }
      }
    }
  },
  {
    url: '/file/upload/video',
    method: 'post',
    response: (request) => {
      const token = request.headers.authorization
      if (!token) {
        return { code: 401, msg: '认证失败,请重新登陆！', success: false }
      }
      return {
        code: 200,
        msg: '上传成功!',
        success: true,
        data: { fileUrl: '' }
      }
    }
  }
]
