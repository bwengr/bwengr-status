import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    ignores: ['dist', '.astro'],
  },
];