# 图标组件说明

## SvgIcon

### Props

| 参数名 | 类型               | 默认值    | 说明                                                         |
| ------ | ------------------ | --------- | ------------------------------------------------------------ |
| icon   | `string`           | `''`      | 图标标识，支持 `icon-park-outline:*` 与 `local:*` 两种前缀。 |
| size   | `number \| string` | `16`      | 图标尺寸。                                                   |
| color  | `string`           | `inherit` | 图标颜色。                                                   |

## IconPark 图标与本地 SVG 图标使用

| 对比项 | IconPark 图标（在线/离线） | 本地 SVG 图标（项目内） |
| --- | --- | --- |
| 图标值写法 | 在线渲染：`icon-park-outline:ad-product`；离线按需导入：`import adProduct from '@iconify-icons/icon-park-outline/ad-product'` | `local:vite` |
| 来源 | IconPark 图标库（可在线拉取，也可通过 `@iconify-icons/icon-park-outline` 离线按需导入） | `src/assets/svg/*.svg` |
| 新增图标成本 | 在线模式接入快；离线模式需要按需导入具体图标模块 | 需要将 svg 文件加入项目 |
| 网络依赖 | 可无（离线按需导入时不依赖网络） | 无 |
| 打包体积影响 | 按需导入影响小；若全量导出 2000+ 图标会显著增加体积 | 可控，按文件数量增长 |
| 适用场景 | 通用图标优先按需离线导入；在线模式更适合大规模检索和预览 | 自定义图标、离线可用 |

## IconPicker

### Props

| 参数名               | 类型             | 默认值                 | 说明                             |
| -------------------- | ---------------- | ---------------------- | -------------------------------- |
| modelValue / v-model | `string \| null` | `null`                 | 当前选中的图标值。               |
| iconSize             | `number`         | `20`                   | 图标网格和已选标签中的图标尺寸。 |
| clearable            | `boolean`        | 继承 `n-select` 默认值 | 是否可清空。                     |
| placeholder          | `string`         | 继承 `n-select` 默认值 | 输入框占位文案。                 |

### Events

| 参数名            | 类型                              | 默认值 | 说明                 |
| ----------------- | --------------------------------- | ------ | -------------------- |
| update:modelValue | `(value: string \| null) => void` | `-`    | 选中图标变化时触发。 |

### Methods

| 参数名 | 类型 | 默认值 | 说明                        |
| ------ | ---- | ------ | --------------------------- |
| 无     | `-`  | `-`    | 当前组件未暴露 `ref` 方法。 |
