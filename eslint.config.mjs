import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'eslint.config.mjs']
  },
  {
    settings: {
      react: {
        version: 'detect',
      }
    },
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ]
  },
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  reactRefresh.configs.vite,
  tseslint.configs.recommended
);
