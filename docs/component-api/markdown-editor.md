# MarkdownEditor 组件说明

## Props

| 参数名               | 类型             | 默认值                      | 说明                          |
| -------------------- | ---------------- | --------------------------- | ----------------------------- |
| modelValue / v-model | `string`         | `''`                        | Markdown 内容，支持双向绑定。 |
| height               | `string`         | `'420px'`                   | 编辑器高度。                  |
| placeholder          | `string`         | `'请输入 Markdown 内容...'` | 输入占位文本。                |
| readOnly             | `boolean`        | `false`                     | 只读模式开关。                |
| disabled             | `boolean`        | `false`                     | 禁用编辑器。                  |
| language             | `string`         | `'zh-CN'`                   | 编辑器语言。                  |
| toolbars             | `ToolbarNames[]` | `[]`                        | 自定义工具栏显示项。          |
| toolbarsExclude      | `ToolbarNames[]` | `[]`                        | 需要隐藏的工具栏项。          |

> 说明：预览功能由编辑器工具栏内置控制，不再通过组件参数单独开关。

## Events

| 事件名            | 类型                      | 说明                           |
| ----------------- | ------------------------- | ------------------------------ |
| update:modelValue | `(value: string) => void` | 内容变更时触发。               |
| change            | `(value: string) => void` | 内容变更回调，便于业务侧联动。 |

## Methods

| 方法名          | 类型                      | 说明             |
| --------------- | ------------------------- | ---------------- |
| clear()         | `() => void`              | 清空当前内容。   |
| setValue(value) | `(value: string) => void` | 设置编辑器内容。 |
| getValue()      | `() => string`            | 获取编辑器内容。 |
| focus()         | `() => void`              | 聚焦编辑器。     |
