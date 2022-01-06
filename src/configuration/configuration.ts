export type CSSStyleType = 'css' | 'sass' | 'scss' | 'less';
export type JSStyleType = 'styled-components';
export type StyleType = CSSStyleType | JSStyleType;
export type Casing = 'kebab' | 'snake' | 'camel' | 'pascal';
export type Scope = 'global' | 'project';

export interface FileNamingConfig {
	name: string;
	postfix: any;
	postfixDevider: string;
	casing: Casing;
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
	type: StyleType;
	modules: boolean;
}

export interface StorybookConfig extends BaseConfig {}

export interface ReduxConfig {}

export interface TestConfig extends BaseConfig {}

export interface HookConfig extends BaseConfig {
	open: boolean;
	defaultExport: boolean;
}

export interface ContextConfig extends BaseConfig {
	hook: boolean;
	open: boolean;
	customProvider: boolean;
	export: {
		destructure: boolean;
		default: boolean;
		inline: boolean;
	};
}

export interface Config {
	project: ProjectConfig;
	component: { [componentType: string]: ComponentConfig };
	style: StyleConfig;
	storybook: StorybookConfig;
	test: TestConfig;
	hook: HookConfig;
	context: ContextConfig;
}
