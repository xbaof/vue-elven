import CryptoJS from 'crypto-js'

// 从环境变量获取密钥，如果没有则使用默认值
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY || 'vue-elven-secret-key-2024'

/**
 * 加密工具类
 */
export class CryptoUtil {
  /**
   * 加密数据
   * @param data 要加密的数据
   * @returns 加密后的字符串
   */
  static encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data)
      return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString()
    } catch (error) {
      console.error('加密失败:', error)
      return ''
    }
  }

  /**
   * 解密数据
   * @param encryptedData 加密的数据
   * @returns 解密后的数据
   */
  static decrypt(encryptedData: string): any {
    try {
      if (!encryptedData) return null

      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('解密失败:', error)
      return null
    }
  }

  /**
   * 检查数据是否为加密格式
   * @param data 要检查的数据
   * @returns 是否为加密格式
   */
  static isEncrypted(data: string): boolean {
    try {
      // 简单的检查：加密后的数据通常包含特殊字符且长度较长
      return data && data.length > 20 && /[^a-zA-Z0-9+/=]/.test(data)
    } catch {
      return false
    }
  }

  /**
   * 生成随机密钥
   * @returns 随机密钥
   */
  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }
}

/**
 * 创建加密的序列化器
 */
export const createEncryptedSerializer = () => ({
  serialize: (value: any) => CryptoUtil.encrypt(value),
  deserialize: (value: string) => CryptoUtil.decrypt(value)
})

/**
 * 创建条件加密序列化器（只对敏感数据进行加密）
 */
export const createConditionalEncryptedSerializer = (sensitiveFields: string[] = []) => ({
  serialize: (value: any) => {
    const encryptedValue: any = {}

    Object.keys(value).forEach((key) => {
      if (sensitiveFields.includes(key)) {
        // 对敏感字段进行加密
        encryptedValue[key] = CryptoUtil.encrypt(value[key])
      } else {
        // 对非敏感字段进行普通序列化
        encryptedValue[key] = value[key]
      }
    })

    return JSON.stringify(encryptedValue)
  },
  deserialize: (value: string) => {
    try {
      const parsed = JSON.parse(value)
      const decryptedValue: any = {}

      Object.keys(parsed).forEach((key) => {
        if (sensitiveFields.includes(key) && CryptoUtil.isEncrypted(parsed[key])) {
          // 解密敏感字段
          decryptedValue[key] = CryptoUtil.decrypt(parsed[key])
        } else {
          // 直接使用非敏感字段
          decryptedValue[key] = parsed[key]
        }
      })

      return decryptedValue
    } catch (error) {
      console.error('反序列化失败:', error)
      return null
    }
  }
})
