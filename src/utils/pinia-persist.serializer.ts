import type { Serializer } from 'pinia-plugin-persistedstate'
import type { StateTree } from 'pinia'
import { CryptoUtil } from './crypto'

/**
 * 创建 Pinia 全局加密序列化器 - 整体加密/解密
 * @returns {Serializer} 序列化器对象
 */
export const createFullEncryptSerializer = (): Serializer => ({
  serialize: (value: StateTree): string => CryptoUtil.encrypt(value),
  deserialize: (value: string): StateTree => CryptoUtil.decrypt<StateTree>(value) ?? {}
})

/**
 * 创建 Pinia 条件加密序列化器 - 只对指定敏感字段加密/解密，非敏感字段原样存储
 * @param sensitiveFields 需要加密的敏感字段数组 如：['token','userInfo','password']
 * @returns {Serializer} 序列化器对象
 */
export const createFieldEncryptSerializer = (sensitiveFields: string[] = []): Serializer => ({
  serialize: (value: StateTree): string => {
    const encryptedValue: Recordable = { ...value }
    Object.keys(encryptedValue).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        encryptedValue[key] = CryptoUtil.encrypt(encryptedValue[key])
      }
    })
    return JSON.stringify(encryptedValue)
  },
  deserialize: (value: string): StateTree => {
    try {
      const parsed = JSON.parse(value) as Recordable
      const decryptedValue: Recordable = {}

      Object.keys(parsed).forEach((key) => {
        const val = parsed[key]
        decryptedValue[key] =
          sensitiveFields.includes(key) && typeof val === 'string' && CryptoUtil.isEncrypted(val)
            ? (CryptoUtil.decrypt(val) ?? val)
            : val
      })
      return decryptedValue as StateTree
    } catch (error) {
      console.error('【Pinia条件序列化-解密失败】', error)
      return {}
    }
  }
})
