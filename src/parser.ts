import { parseSync } from '@babel/core';
import path from 'path';

const nodeModulesPath = path.join(
	__dirname,
	process.env.NODE_ENV === 'development' ? '../' : '',
	'node_modules'
);

export const parser = {
	parse: (source: any) =>
		parseSync(source, {
			plugins: [
				path.join(nodeModulesPath, `@babel/plugin-proposal-class-properties`),
				path.join(nodeModulesPath, `@babel/plugin-syntax-jsx`),
			],
			overrides: [
				{
					test: [`**/*.ts`, `**/*.tsx`],
					plugins: [
						[
							path.join(nodeModulesPath, `@babel/plugin-syntax-typescript`),
							{ isTSX: true },
						],
					],
				},
			],
			filename: 'source-file.tsx',
			parserOpts: {
				tokens: true,
			},
		}),
};
