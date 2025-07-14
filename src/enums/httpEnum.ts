/**
 * 响应码枚举
 */
export enum StatusCodeEnum {
  // 成功
  SUCCESS = 200,
  // 未登录
  UNAUTHORIZED = 401,
  // 无权限
  FORBIDDEN = 403,
  // 404
  NOT_FOUND = 404,
  // 系统内部错误
  INTERNAL_SERVER_ERROR = 500
}
