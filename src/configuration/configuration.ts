export type cssStyleType = 'css' | 'sass' | 'scss' | 'less';
export type jsStyleType = 'styled-components';
export type styleType = cssStyleType | jsStyleType;
export type projectType = 'cra' | 'next' | 'gatsby';
export type testingLib = 'enzyme' | 'react-testing';
export type casing = 'kebab' | 'snake' | 'camel' | 'pascal';
export type scope = 'global' | 'project';

export interface FileNamingConfig {
	name: string;
	postfix: any;
	postfixDevider: string;
	casing: casing;
}

export interface BaseConfig {
	path: string;
	typescript: boolean;
	fileNaming: FileNamingConfig;
	inFolder: boolean;
}
export interface ProjectConfig {
	path: string;
	typescript: boolean;
	fileNaming: FileNamingConfig;
	lint: boolean;
	format: boolean;
	verbose: boolean;
}

export interface ComponentConfig extends BaseConfig {
	class: boolean;
	style: boolean;
	story: boolean;
	proptypes: boolean;
	redux: boolean;
	test: boolean;
	index: boolean;
	open: boolean;
	testId: boolean;
	defaultExport: boolean;
	override?: {
		style?: StyleConfig;
		storybook?: StorybookConfig;
		test?: TestConfig;
	};
}

export interface StyleConfig extends BaseConfig {
	type: styleType;
	modules: boolean;
}

export interface StorybookConfig extends BaseConfig {}

export interface ReduxConfig {}

export interface TestConfig extends BaseConfig {}

export interface HookConfig extends BaseConfig {
	open: boolean;
}

export interface Config {
	project: ProjectConfig;
	component: { [componentType: string]: ComponentConfig };
	style: StyleConfig;
	storybook: StorybookConfig;
	test: TestConfig;
	hook: HookConfig;
}
