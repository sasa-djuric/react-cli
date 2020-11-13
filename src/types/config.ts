export type cssStyleType = 'css' | 'sass' | 'scss' | 'less';
export type jsStyleType = 'styled-components';
export type styleType = cssStyleType | jsStyleType;
export type projectType = 'cra' | 'next' | 'gatsby';
export type testingLib = 'jest' | 'enzyme' | 'react-testing';
export interface ProjectConfig {
	typescript: boolean;
}

export interface ComponentConfig {
	typescript?: boolean;
	path: string;
	style: boolean;
	story: boolean;
	proptypes: boolean;
	test: boolean;
	index: boolean;
	inFolder: boolean;
	open: boolean;
	casing: 'kebab' | 'snake' | 'camel' | 'pascal';
	naming: 'name' | 'index';
	fileNamePostfix?: string;
}

export interface StyleConfig {
	type: styleType;
	modules: boolean;
	naming: string;
}

export interface Config {
	project: ProjectConfig;
	component: ComponentConfig;
	style: StyleConfig;
	storyBook?: {};
	redux?: {};
	testing?: {};
}
