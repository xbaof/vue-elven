# WangEditor 组件说明

## Props

| 参数名               | 类型                      | 默认值      | 说明                               |
| -------------------- | ------------------------- | ----------- | ---------------------------------- |
| modelValue / v-model | `string`                  | `''`        | 编辑器 HTML 内容，支持双向绑定。   |
| height               | `string`                  | `'360px'`   | 编辑区高度。                       |
| mode                 | `'default' \| 'simple'`   | `'default'` | 编辑器模式。                       |
| hideToolBar          | `boolean`                 | `false`     | 是否隐藏工具栏。                   |
| disabled             | `boolean`                 | `false`     | 是否禁用编辑器。                   |
| toolbarConfig        | `Partial<IToolbarConfig>` | `{}`        | 工具栏配置，支持透传。             |
| editorConfig         | `Partial<IEditorConfig>`  | `{}`        | 编辑器配置，支持覆盖默认上传逻辑。 |

## Events

| 参数名 | 类型                           | 默认值 | 说明                   |
| ------ | ------------------------------ | ------ | ---------------------- |
| focus  | `(editor: IDomEditor) => void` | `-`    | 编辑器聚焦时触发。     |
| blur   | `(editor: IDomEditor) => void` | `-`    | 编辑器失焦时触发。     |
| change | `(editor: IDomEditor) => void` | `-`    | 编辑器内容变化时触发。 |

## Methods

| 参数名                | 类型                     | 默认值 | 说明                                  |
| --------------------- | ------------------------ | ------ | ------------------------------------- |
| focus()               | `() => void`             | `-`    | 通过 `ref` 调用，让编辑器聚焦。       |
| clear()               | `() => void`             | `-`    | 通过 `ref` 调用，清空编辑内容。       |
| getHtml()             | `() => string`           | `-`    | 通过 `ref` 调用，返回当前 HTML 内容。 |
| setHtml(html: string) | `(html: string) => void` | `-`    | 通过 `ref` 调用，设置 HTML 内容。     |
