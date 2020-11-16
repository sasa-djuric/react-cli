import { Config } from '../types/config';

export const projectTypes = [
	{ name: 'Create React App', value: 'cra' },
	{ name: 'Next', value: 'next' },
	{ name: 'Gatsby', value: 'gatsby' },
];

export const cssStyleTypes = ['css', 'scss', 'sass', 'less'];
export const jsStyleTypes = ['styled-components'];
export const styleTypes = [...cssStyleTypes, ...jsStyleTypes];

export const defaultConfig: any = {
	project: {
		path: './src',
		typescript: false,
	},
	component: {
		directory: 'components',
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
	page: {
		directory: 'pages',
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
	view: {
		directory: 'views',
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
	container: {
		directory: 'containers',
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
	layout: {
		directory: 'layout',
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

// types: [
// 	{ type: "component"; directory: "components" },
// 	{ type: "page"; directory: "pages" },
// 	{ type: "view"; directory: "views" },
// 	{ type: "container"; directory: "containers" },
// 	{ type: "layout"; directory: "layout" }
// ];
