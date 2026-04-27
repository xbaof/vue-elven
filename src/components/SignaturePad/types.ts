export interface SignaturePadProps {
  /** 画布高度，支持 number 和 CSS 字符串。 */
  height?: StringNumber
  /** 画布背景色。 */
  backgroundColor?: string
  /** 画笔颜色。 */
  penColor?: string
  /** 画笔最小宽度。 */
  minWidth?: number
  /** 画笔最大宽度。 */
  maxWidth?: number
  /** 是否禁用签名。 */
  disabled?: boolean
}

export interface SignatureEndPayload {
  isEmpty: boolean
  base64: string
}

export interface SignaturePadEmits {
  (eventName: 'change', isEmpty: boolean): void
  (eventName: 'end', payload: SignatureEndPayload): void
}

export interface SignaturePadExpose {
  clear: () => void
  isEmpty: () => boolean
  toBase64: (type?: string, encoderOptions?: number) => string
  toBlob: (type?: string, encoderOptions?: number) => Promise<Blob | null>
  fromDataUrl: (dataUrl: string) => Promise<void>
}
