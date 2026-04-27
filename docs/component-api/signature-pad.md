# SignaturePad 组件说明

## Props

| 参数名          | 类型               | 默认值      | 说明                              |
| --------------- | ------------------ | ----------- | --------------------------------- |
| height          | `number \| string` | `260`       | 画布高度，支持数字或 CSS 字符串。 |
| backgroundColor | `string`           | `'#ffffff'` | 画布背景色。                      |
| penColor        | `string`           | `'#1f2937'` | 画笔颜色。                        |
| minWidth        | `number`           | `1`         | 画笔最小宽度。                    |
| maxWidth        | `number`           | `2.5`       | 画笔最大宽度。                    |
| disabled        | `boolean`          | `false`     | 是否禁用签名输入。                |

## Events

| 事件名 | 类型                                                      | 说明                                    |
| ------ | --------------------------------------------------------- | --------------------------------------- |
| change | `(isEmpty: boolean) => void`                              | 签名内容变化时触发。                    |
| end    | `(payload: { isEmpty: boolean; base64: string }) => void` | 一次落笔完成后触发，并返回当前 Base64。 |

## Methods

| 方法名      | 类型                                                                | 说明                            |
| ----------- | ------------------------------------------------------------------- | ------------------------------- |
| clear       | `() => void`                                                        | 清空签名内容。                  |
| isEmpty     | `() => boolean`                                                     | 判断当前签名是否为空。          |
| toBase64    | `(type?: string, encoderOptions?: number) => string`                | 导出 Base64，默认 `image/png`。 |
| toBlob      | `(type?: string, encoderOptions?: number) => Promise<Blob \| null>` | 导出 Blob，默认 `image/png`。   |
| fromDataUrl | `(dataUrl: string) => Promise<void>`                                | 通过 dataUrl 回填签名。         |
