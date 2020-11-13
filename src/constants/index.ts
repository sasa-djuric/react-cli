import { Config } from '../types/config';

export const projectTypes = [
	{ name: 'Create React App', value: 'cra' },
	{ name: 'Next', value: 'next' },
	{ name: 'Gatsby', value: 'gatsby' },
];

export const cssStyleTypes = ['css', 'scss', 'sass', 'less'];
export const jsStyleTypes = ['styled-components'];
export const styleTypes = [...cssStyleTypes, ...jsStyleTypes];

export const defaultConfig: Config = {
	project: {
		typescript: false,
	},
	component: {
		path: './src/components',
		casing: 'kebab',
		naming: 'name',
		style: true,
		story: false,
		proptypes: false,
		test: false,
		index: false,
		inFolder: true,
		open: true,
	},
	style: {
		type: 'scss',
		modules: false,
		naming: 'string',
	},
};
