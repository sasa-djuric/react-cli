export type cssStyleType = 'css' | 'sass' | 'scss' | 'less';
export type jsStyleType = 'styled-components';
export type styleType = cssStyleType | jsStyleType;
export type projectType = 'cra' | 'next' | 'gatsby';
export type testingLib = 'jest' | 'enzyme' | 'react-testing';
export interface ProjectConfig {
	path: string;
	typescript: boolean;
}

export interface ComponentConfig {
	directory: string;
	typescript?: boolean;
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

interface IConfig {
	project: ProjectConfig;
	component: ComponentConfig;
	style: StyleConfig;
	storyBook?: {};
	redux?: {};
	testing?: {};
}

export type Config = { [key: string]: ComponentConfig } & IConfig;
