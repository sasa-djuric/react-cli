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

export interface ExportConfig {
	default: boolean;
	inline: boolean;
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
	export: ExportConfig;
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
	export: ExportConfig;
	override?: {
		style?: StyleConfig;
		storybook?: StorybookConfig;
		test?: TestConfig;
	};
}

export interface StyleConfig extends BaseConfig {
	type: StyleType;
	modules: boolean;
	export: ExportConfig;
}

export interface StorybookConfig extends BaseConfig {}

export interface ReduxConfig {}

export interface TestConfig extends BaseConfig {}

export interface HookConfig extends BaseConfig {
	open: boolean;
	export: ExportConfig;
}

export interface Config {
	project: ProjectConfig;
	component: { [componentType: string]: ComponentConfig };
	style: StyleConfig;
	storybook: StorybookConfig;
	test: TestConfig;
	hook: HookConfig;
}
