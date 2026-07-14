import { oxlint } from '@jterrazz/typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [oxlint.next],
    rules: {
        'arrow-body-style': ['error', 'always'],
        'import/exports-last': 'off',
        'import/no-namespace': 'off',
        'no-nested-ternary': 'off',
        'react/jsx-max-depth': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/no-array-index-key': 'off',
        'react/react-in-jsx-scope': 'off',
    },
});
