import js from '@eslint/js'
import typescript from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import parserVue from 'vue-eslint-parser'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
  // 全局忽略文件
  {
    ignores: ['dist/**', 'node_modules/**', 'public/*', 'src/assets/**']
  },
  // 通用 文件配置
  {
    files: ['**/*.js', '**/*.cjs'],
    ...js.configs.recommended,
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,
      'no-debugger': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto' // 自动处理换行符
        }
      ]
    }
  },
  // TypeScript 文件配置
  ...typescript.config({
    extends: [...typescript.configs.recommended],
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescript.parser, // 从统一包中获取parser
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescript.plugin // 从统一包中获取plugin
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }
      ]
    }
  }),
  // Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        parser: typescript.parser // 使用统一包中的parser
      }
    },
    plugins: {
      '@typescript-eslint': typescript.plugin,
      vue: pluginVue
    },
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs.essential.rules,
      ...pluginVue.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'no-useless-escape': 'off',
      'no-var': 'error',
      // 禁用debugger
      'no-debugger': 'warn',
      // 禁止出现重复的 case 标签
      'no-duplicate-case': 'warn',
      // 禁止出现空语句块
      'no-empty': 'warn'
    }
  },
  // TypeScript 声明文件
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // 禁用未使用变量的警告
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/ban-types': 'off' // 允许使用 Object 和 Function 类型
    }
  }
]
