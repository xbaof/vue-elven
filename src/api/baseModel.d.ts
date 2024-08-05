interface Result {
  success: boolean
  msg: string
}
interface ResultModel<T> extends Result {
  data?: T
}
