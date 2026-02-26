// @see https://stylelint.bootcss.com/
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-html/vue',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-recess-order'
  ],
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss'
    }
  ],
  ignoreFiles: ['**/*.{js,jsx,ts,tsx,json,md,yaml}', 'dist/**', 'node_modules/**', 'public/**'],
  /*
   * null  => 关闭该规则
   * always => 必须
   */
  rules: {
    // 关闭一些不适合项目的规则
    'font-family-no-missing-generic-family-keyword': null,
    'value-keyword-case': null, // 允许在 CSS 中使用 v-bind
    'no-descending-specificity': null, // 允许选择器优先级下降
    'no-empty-source': null, // 允许空源码
    'selector-class-pattern': null, // 不强制选择器类名格式
    'property-no-unknown': null, // 允许未知属性（适应 Vue 的动态属性）
    'value-no-vendor-prefix': null, // 允许属性值前缀
    'property-no-vendor-prefix': null, // 允许属性前缀

    // 自定义规则
    'function-url-quotes': 'always', // URL 必须加引号
    'color-hex-length': 'long', // 16 进制颜色使用长格式
    'selector-pseudo-class-no-unknown': [
      // 不允许未知的选择器
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep', 'export'] // 忽略 Vue 相关伪类
      }
    ]
  }
}
