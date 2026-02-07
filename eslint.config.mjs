// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'

export default withNuxt(
    // Your custom configs here
    [
        {
            files: ['**/*.ts', '**/*.vue'],
            plugins: { perfectionist, 'unused-imports': unusedImports },
            rules: {
                'no-empty': 'warn',
                'no-empty-pattern': 'warn',
                '@typescript-eslint/no-empty-object-type': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-unsafe-function-type': 'off',
                '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' }],
                'object-shorthand': ['error', 'always'],
                'perfectionist/sort-array-includes': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-classes': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-decorators': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-enums': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-exports': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-heritage-clauses': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-imports': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-interfaces': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-intersection-types': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-jsx-props': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-maps': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-modules': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-object-types': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-objects': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-sets': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-switch-case': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-union-types': ['error', { order: 'asc', type: 'alphabetical' }],
                'perfectionist/sort-variable-declarations': ['error', { order: 'asc', type: 'alphabetical' }],
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' }],
            },
        },
        {
            files: ['**/*.vue'],
            rules: {
                'vue/attribute-hyphenation': ['error', 'never'],
                'vue/attributes-order': ['error', { alphabetical: true }],
                'vue/custom-event-name-casing': ['error', 'camelCase'],
                'vue/html-self-closing': ['error', { html: { component: 'always', normal: 'always', void: 'always' } }],
                'vue/multi-word-component-names': 'off',
                'vue/no-multiple-template-root': 'off',
                'vue/no-v-html': 'off',
                'vue/prop-name-casing': ['error', 'camelCase'],
                'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
            },
        },
    ],
)
