/**
 * RGB颜色值的类型约束
 * r, g, b 每个元素取值 0-255
 */
export interface RgbColor {
  r: number
  g: number
  b: number
}

/**
 * HSL颜色值的类型约束：number[] 格式，对应 [h, s, l]
 * h: 色相 0-360，s: 饱和度 0-100，l: 亮度 0-100
 */
export interface HslColor {
  h: number
  s: number
  l: number
}

/**
 * 判断是否为合法的16进制颜色值
 * @param color 待校验颜色值 支持 #fff / #ffffff 格式
 */
export function isHexColor(color: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
}

/**
 * 判断是否为合法的RGB颜色值
 * @param color 待校验颜色值 格式 rgb(0,0,0)
 */
export function isRgbColor(color: string): boolean {
  return /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(color)
}

const showColorError = (message: string): void => {
  window.$notification.warning({
    content: '异常',
    meta: message,
    duration: 2500,
    keepAliveOnHover: true
  })
}

const normalizeHex = (hex: string): string => {
  let newHex = hex.toLowerCase().slice(1)
  if (newHex.length === 3) {
    newHex = newHex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  return newHex
}

/**
 * 16进制颜色值 转 RGB颜色值
 * @param hex 16进制颜色 #fff / #ffffff
 * @returns 标准rgb格式字符串 rgb(255,255,255)
 */
export function hexToRgb(hex: string): string {
  if (!isHexColor(hex)) {
    showColorError(`传入的不是合法16进制颜色值: ${hex}`)
    return hex
  }

  const newHex = normalizeHex(hex)
  const r = parseInt(newHex.slice(0, 2), 16)
  const g = parseInt(newHex.slice(2, 4), 16)
  const b = parseInt(newHex.slice(4, 6), 16)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * 16进制颜色值 转 RGB对象
 * @param hex 16进制颜色 #fff / #ffffff
 * @returns { r: number, g: number, b: number }
 */
export function hexToRgbObj(hex: string): RgbColor {
  if (!isHexColor(hex)) {
    showColorError(`传入的不是合法16进制颜色值: ${hex}`)
    return { r: 255, g: 255, b: 255 }
  }

  const newHex = normalizeHex(hex)
  return {
    r: parseInt(newHex.slice(0, 2), 16),
    g: parseInt(newHex.slice(2, 4), 16),
    b: parseInt(newHex.slice(4, 6), 16)
  }
}

/**
 * RGB颜色值 转 16进制颜色值
 * @param rgb RGB颜色值 rgb(255,255,255)
 * @returns 标准6位16进制颜色 #ffffff
 */
export function rgbToHex(rgb: string): string {
  if (!isRgbColor(rgb)) {
    showColorError(`传入的不是合法RGB颜色值: ${rgb}`)
    return rgb
  }

  const match = rgb.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/)
  if (!match) return '#ffffff'

  const hex = (x: string) => {
    const hexVal = parseInt(x).toString(16)
    return hexVal.length === 1 ? '0' + hexVal : hexVal
  }

  return `#${hex(match[1])}${hex(match[2])}${hex(match[3])}`.toLowerCase()
}

/**
 * RGB对象 转 16进制颜色值
 * @param rgbObj { r: number, g: number, b: number }
 * @returns 标准6位16进制颜色 #ffffff
 */
export function rgbObjToHex(rgbObj: RgbColor): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val))
  const hex = (x: number) => {
    const hexVal = clamp(x).toString(16)
    return hexVal.length === 1 ? '0' + hexVal : hexVal
  }

  return `#${hex(rgbObj.r)}${hex(rgbObj.g)}${hex(rgbObj.b)}`.toLowerCase()
}

/**
 * RGB数组 转 HSL对象（核心辅助方法，为Hex转HSL提供支撑）
 * @param rgbArr [r, g, b] 格式数组，每个元素 0-255
 * @returns HslColor 对象 { h: 0-360, s: 0-100, l: 0-100 }
 */
function rgbToHslObj(rgbArr: RgbColor): HslColor {
  let { r, g, b } = rgbArr
  // 第一步：将 RGB 数值归一化到 0-1 范围
  r /= 255
  g /= 255
  b /= 255

  // 第二步：计算 RGB 中的最大值、最小值
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  // 第三步：计算色相（h）和饱和度（s）（排除灰度色，max === min 时为灰度色，h=0，s=0）
  if (max !== min) {
    const delta = max - min

    // 计算饱和度（s）
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    // 计算色相（h）
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }
    h *= 60 // 转换为 0-360 范围
  }

  // 第四步：格式化数值，保留合理精度并转换为 HslColor 对象返回
  return {
    h: Math.round(h), // 色相 0-360，取整
    s: Math.round(s * 100), // 饱和度 0-100，取整
    l: Math.round(l * 100) // 亮度 0-100，取整
  }
}

/**
 * 方法1：16进制颜色值 转 HSL 格式字符串（直接可用作CSS颜色值）
 * @param hex 16进制颜色 #fff / #ffffff
 * @returns 标准hsl格式字符串 hsl(360, 100%, 100%)
 */
export function hexToHsl(hex: string): string {
  if (!isHexColor(hex)) {
    showColorError(`传入的不是合法16进制颜色值: ${hex}`)
    return hex
  }

  // 步骤：Hex -> RGB数组 -> HSL对象 -> HSL字符串
  const rgbArr = hexToRgbObj(hex)
  const hslObj = rgbToHslObj(rgbArr)

  // 拼接为标准HSL字符串（饱和度和亮度带 % 符号）
  return `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`
}

/**
 * 方法2：16进制颜色值 转 HSL 对象（方便后续数值计算处理）
 * @param hex 16进制颜色 #fff / #ffffff
 * @returns HslColor 对象 { h: 0-360, s: 0-100, l: 0-100 }
 */
export function hexToHslObj(hex: string): HslColor {
  if (!isHexColor(hex)) {
    showColorError(`传入的不是合法16进制颜色值: ${hex}`)
    return { h: 0, s: 0, l: 100 } // 默认返回白色对应的HslColor对象
  }

  // 步骤：Hex -> RGB数组 -> HSL对象，直接返回结果
  const rgbArr = hexToRgbObj(hex)
  return rgbToHslObj(rgbArr)
}
