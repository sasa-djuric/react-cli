export const defaultConfiguration: any = {
	project: {
		path: '/',
		typescript: false,
		fileNaming: {
			name: '{name}',
			postfix: '',
			postfixDevider: '.',
			casing: 'kebab',
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
};
