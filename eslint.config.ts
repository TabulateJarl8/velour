import pluginVitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginOxlint from 'eslint-plugin-oxlint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    files: ['**/*.{vue,ts,mts}'],
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'require-unicode-regexp': ['error', { requireFlag: 'v' }],
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    ...pluginJsdoc.configs['flat/recommended-typescript'],
    files: ['**/*.{ts,mts,js}'],
    rules: {
      ...pluginJsdoc.configs['flat/recommended-typescript'].rules,
      'jsdoc/tag-lines': ['warn', 'any', { startLines: 1, startLinesWithNoTags: 0 }],
      'jsdoc/require-jsdoc': ['warn', { enableFixer: false }],
    },
    settings: {
      jsdoc: {
        tagNamePreference: {
          augments: 'extends',
        },
      },
    },
  },

  {
    name: 'app/import-sorting',
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  skipFormatting,
)
