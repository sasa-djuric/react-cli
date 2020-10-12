import { Config } from '../types/config';

export const projectTypes = [
	{ name: 'cra', label: 'Create React App' },
	{ name: 'next', label: 'Next' },
	{ name: 'gatsby', label: 'Gatsby' },
];

export const styleTypes = ['css', 'scss', 'saas', 'less', 'styled-components'];

export const defaultConfig: Config = {
	project: {
		type: 'cra',
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
	},
};
