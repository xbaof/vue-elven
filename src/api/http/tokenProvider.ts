type TokenGetter = () => string | undefined | null

let tokenGetter: TokenGetter | null = null

export const setTokenGetter = (getter: TokenGetter): void => {
  tokenGetter = getter
}

export const getToken = (): string => {
  const token = tokenGetter?.()
  return typeof token === 'string' ? token : ''
}
