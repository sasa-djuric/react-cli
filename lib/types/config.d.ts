export declare type styleType = 'css' | 'scss' | 'saas' | 'less' | 'styled-components';
export declare type projectType = 'cra' | 'next' | 'gatsby';
export declare type testingLib = 'jest' | 'enzyme' | 'react-testing';
export interface ProjectConfig {
    type: projectType;
    typescript: boolean;
    indentation?: number;
}
export interface ComponentConfig {
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
}
export interface StyleConfig {
    type: 'css' | 'scss' | 'saas' | 'less' | 'styled-components';
    modules: boolean;
}
export interface Config {
    project: ProjectConfig;
    component: ComponentConfig;
    style: StyleConfig;
    storyBook?: {};
    redux?: {};
    testing?: {};
}
