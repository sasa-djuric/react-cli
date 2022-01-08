import { Config } from '.';
import { DeepPartial } from '../types/deep-partial';

export const defaultConfiguration: DeepPartial<Config> = Object.freeze({
	project: {
		path: '/',
		typescript: false,
		lint: false,
		format: false,
		verbose: true,
		fileNaming: {
			name: '{name}',
			postfix: '',
			postfixDevider: '.',
			casing: 'kebab',
		},
		export: {
			default: false,
			inline: true,
		},
	},
	component: {
		default: {
			class: false,
			style: true,
			story: false,
			test: false,
			proptypes: false,
			redux: false,
			index: false,
			testId: false,
			inFolder: true,
			open: false,
			path: '/components',
			fileNaming: {
				name: '{name}',
				postfix: '',
				postfixDevider: '.',
				casing: 'kebab',
			},
		},
	},
	style: {
		type: 'css',
		modules: false,
		path: '{componentPath}',
		export: {
			default: false,
			inline: true,
		},
	},
	storybook: {
		path: '{componentPath}',
		fileNaming: {
			postfix: 'stories',
		},
	},
	test: {
		path: '{componentPath}',
		fileNaming: {
			postfix: 'test',
		},
	},
	hook: {
		path: '/hooks',
		fileNaming: {
			casing: 'camel',
		},
	},
	context: {
		path: '/contexts',
		export: {
			default: false,
			destructure: false,
			inline: true,
		},
		hook: true,
		open: true,
		customProvider: false,
		fileNaming: {
			casing: 'kebab',
		},
	},
});
