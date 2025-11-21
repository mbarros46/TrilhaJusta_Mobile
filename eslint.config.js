const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
				project: './tsconfig.json',
			},
		},
		plugins: { '@typescript-eslint': tsPlugin },
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
];
