import CryptoJS from 'crypto-js'

const SECRET_KEY_STR = (import.meta.env.VITE_CRYPTO_SECRET_KEY || 'CvYLmIf1iV0Ecibc').padEnd(16, 'x').slice(0, 16)
const SECRET_IV_STR = (import.meta.env.VITE_CRYPTO_IV_KEY || '8s2k7G5p1d9F3z6v').padEnd(16, 'x').slice(0, 16)

const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_STR)
const SECRET_IV = CryptoJS.enc.Utf8.parse(SECRET_IV_STR)

const AES_CONFIG = {
  iv: SECRET_IV,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}

/**
 * 解析解密后的字符串，优先按 JSON 解析，失败则返回原字符串。
 */
const parseDecryptedData = (plainText: string): unknown => {
  try {
    return JSON.parse(plainText)
  } catch {
    return plainText
  }
}

/**
 * 加密工具类
 */
export class CryptoUtil {
  /**
   * 加密数据
   * @param data 任意类型数据：字符串/数字/对象/数组/null/undefined
   * @returns 加密后的Base64密文字符串，加密失败返回空字符串
   */
  static encrypt(data: Nullable<unknown>): string {
    try {
      if (data === null || data === undefined) return ''
      // 字符串直接加密，其他类型JSON序列化后加密
      const handleData = typeof data === 'string' ? data : JSON.stringify(data)
      const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(handleData), SECRET_KEY, AES_CONFIG)
      return encrypted.toString()
    } catch (error) {
      console.error('【AES加密失败】', error)
      return ''
    }
  }

  /**
   * 解密数据
   * @param encryptedData 加密后的Base64密文字符串
   * @returns 泛型指定的原数据类型，解密失败返回null
   */
  static decrypt<T = unknown>(encryptedData: Nullable<string>): Nullable<T> {
    try {
      if (!encryptedData || typeof encryptedData !== 'string') return null
      const decryptResult = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, AES_CONFIG)
      const plainText = decryptResult.toString(CryptoJS.enc.Utf8)
      if (!plainText) return null

      return parseDecryptedData(plainText) as T
    } catch (error) {
      console.error('【AES解密失败】', error)
      return null
    }
  }

  /**
   * 校验是否为加密后的密文格式
   * @param data 待校验的数据
   * @returns boolean 是/否为密文
   */
  static isEncrypted(data: unknown): boolean {
    return typeof data === 'string' && data.length > 20 && /^[a-zA-Z0-9+/=]+$/.test(data)
  }
}
