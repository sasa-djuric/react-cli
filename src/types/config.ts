export type styleType = 'css' | 'scss' | 'saas' | 'less' | 'styled-components';

export interface Config {
	project: {
		type: 'cra' | 'next' | 'gatsby';
		typescript: boolean;
	};
	component: {
		path: string;
		withStyle: boolean;
		withStroy: boolean;
		withProptypes: boolean;
		withTest: boolean;
		withIndex: boolean;
		inFolder: boolean;
		casing: 'kebab' | 'snake' | 'camel' | 'pascal';
		naming: 'name' | 'index';
	};
	style: {
		type: 'css' | 'scss' | 'saas' | 'less' | 'styled-components';
		modules: true;
	};
	storyBook?: {};
	redux?: {};
	testing?: {};
}
