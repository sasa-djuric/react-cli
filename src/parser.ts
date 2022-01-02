import { parseSync } from '@babel/core';

export const parser = {
	parse: (source: any) =>
		parseSync(source, {
			plugins: [
				`@babel/plugin-syntax-jsx`,
				`@babel/plugin-proposal-class-properties`,
			],
			overrides: [
				{
					test: [`**/*.ts`, `**/*.tsx`],
					plugins: [[`@babel/plugin-syntax-typescript`, { isTSX: true }]],
				},
			],
			filename: 'source-file.tsx',
			parserOpts: {
				tokens: true,
			},
		}),
};
