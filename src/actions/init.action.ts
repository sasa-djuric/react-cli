// Libs
import inquirer from 'inquirer';
import clear from 'clear';

// Constants
import { cssStyleTypes, styleTypes } from '../constants';

// Configuration
import { createConfigurationFile } from '../configuration';

// Types
import { Scope } from '../configuration';

// Helpers
import BaseAction from './base.action';

class InitAction extends BaseAction {
	async handle() {
		clear();

		const config: any = {};
		const parts = [
			{ name: 'project', prompt: project },
			{ name: 'component', prompt: component },
			{ name: 'style', prompt: style },
		];
		const scope = await this.getScope();

		for (const part of parts) {
			config[part.name] = await part.prompt(scope);
		}

		this.createConfig(config, scope);
	}

	private getScope() {
		return inquirer
			.prompt([
				{
					type: 'list',
					name: 'scope',
					message: 'For what scope you want to make configuration?',
					choices: [
						{ name: 'Global', value: 'global' },
						{ name: 'Project', value: 'project' },
					],
				},
			])
			.then((res) => res.scope);
	}

	private createConfig(config: any, scope: 'global' | 'project') {
		createConfigurationFile(config, scope);
	}
}

const project = (scope: Scope) =>
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'path',
				message: 'Project source path ./src ?',
			},
			{
				type: 'input',
				name: 'manualPath',
				message: 'Input project source folder path',
				when: (res) => !res.path,
			},
			{
				type: 'confirm',
				name: 'typescript',
				message: 'Using typescript?',
			},
			{
				type: 'list',
				name: 'casing',
				message: 'Global file name casing',
				choices: [
					{ name: 'Kebab', value: 'kebab' },
					{ name: 'Snake', value: 'snake' },
					{ name: 'Camel', value: 'camel' },
					{ name: 'Pascal', value: 'pascal' },
				],
			},
		])
		.then((result) => {
			if (result.path) {
				result.path = './src';
			} else {
				result.path = result.manualPath;
				delete result.manualPath;
			}

			result.fileNaming = {
				casing: result.casing,
			};

			delete result.casing;

			return result;
		});

const component = (scope: Scope) =>
	inquirer
		.prompt([
			{ type: 'confirm', name: 'style', message: 'Create style file?' },
			{ type: 'confirm', name: 'story', message: 'Create story file?' },
			{ type: 'confirm', name: 'test', message: 'Create test file?' },
			{ type: 'confirm', name: 'proptypes', message: 'Use proptypes?' },
			{
				type: 'list',
				name: 'naming',
				message: 'File naming',
				choices: [
					{ name: 'Component name', value: '{name}' },
					{ name: 'index', value: 'index' },
				],
			},
			{
				type: 'input',
				name: 'fileNamePostfix',
				message: 'File name postfix (eg .component) *optional',
			},
			{
				type: 'confirm',
				name: 'index',
				message: 'Create index export file?',
				when: (result) => result.naming !== 'index',
			},
			{
				type: 'confirm',
				name: 'inFolder',
				message: 'Create folder for component?',
			},
			{
				type: 'list',
				name: 'casing',
				message: 'Component file name casing',
				choices: [
					{ name: 'Kebab', value: 'kebab' },
					{ name: 'Snake', value: 'snake' },
					{ name: 'Camel', value: 'camel' },
					{ name: 'Pascal', value: 'pascal' },
				],
			},
			{
				type: 'confirm',
				name: 'open',
				message: 'Open component file in default editor after creating?',
			},
			{
				type: 'checkbox',
				name: 'components',
				message: 'Select types of components you will be using',
				choices: [
					{ name: 'Component', value: 'default', checked: true },
					{ name: 'Page', value: 'page' },
					{ name: 'Container', value: 'container' },
					{ name: 'View', value: 'view' },
					{ name: 'Layout', value: 'layout' },
				],
			},
		])
		.then((result) => {
			if (
				result.fileNamePostfix?.toLowerCase() === 'n' ||
				result.fileNamePostfix?.toLowerCase() === 'no'
			) {
				delete result.fileNamePostfix;
			}

			const components = [...result.components];
			const defaultComponent = { ...result };
			const config: any = {};

			defaultComponent.fileNaming = {
				name: defaultComponent.naming,
				postfix: defaultComponent.fileNamePostfix || '',
				casing: defaultComponent.casing,
			};

			delete defaultComponent.components;
			delete defaultComponent.naming;
			delete defaultComponent.fileNamePostfix;
			delete defaultComponent.casing;

			components.forEach((type: string) => {
				const directoryName = type === 'default' ? 'component' : type;

				config[type] = {
					...defaultComponent,
					path: `/${directoryName}s`,
				};
			});

			return config;
		});

const style = (scope: Scope) =>
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Styling type',
				choices: styleTypes,
			},
			{
				type: 'confirm',
				name: 'modules',
				message: 'Use modules',
				when: (result) => cssStyleTypes.some((type) => result.type === type),
			},
			{
				type: 'list',
				name: 'naming',
				message: 'Style file naming',
				choices: [
					{ name: 'Component name', value: '{name}' },
					{ name: 'Style', value: 'style' },
					{ name: 'Other', value: 'other' },
				],
			},
			{
				type: 'input',
				name: 'customStyleNaming',
				message: 'Input style file name',
				when: (result) => result.naming === 'other',
			},
		])
		.then((result) => {
			if (result.customStyleNaming) {
				result.naming = result.customStyleNaming;
				delete result.customStyleNaming;
			}

			result.fileNaming = {
				name: result.naming,
			};

			delete result.naming;

			return result;
		});

export default InitAction;
