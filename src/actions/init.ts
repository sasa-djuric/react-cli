// Libs
import inquirer from 'inquirer';

// Constants
import { cssStyleTypes, projectTypes, styleTypes } from '../constants';

// Services
import configService from '../services/config';

// Types
import { scope } from '../types';

function project(scope: scope) {
	return inquirer.prompt([
		{
			type: 'confirm',
			name: 'typescript',
			message: 'Using typescript?',
			when: () => scope === 'global',
		},
	]);
}

function component(scope: scope) {
	return inquirer
		.prompt([
			{ type: 'confirm', name: 'defaultPath', message: 'Component path src/components ?' },
			{ type: 'input', name: 'path', message: 'Component path', when: answers => !answers.defaultPath },
			{ type: 'confirm', name: 'style', message: 'Create style file?' },
			{ type: 'confirm', name: 'story', message: 'Create story file?' },
			{ type: 'confirm', name: 'test', message: 'Create test file?' },
			{ type: 'confirm', name: 'proptypes', message: 'Use proptypes?' },
			{ type: 'list', name: 'naming', message: 'File naming', choices: ['name', 'index'] },
			{
				type: 'input',
				name: 'fileNamePostfix',
				message: 'File name postfix (eg .component) *optional',
			},
			{
				type: 'confirm',
				name: 'index',
				message: 'Create index export file?',
				when: result => result.naming !== 'index',
			},
			{ type: 'confirm', name: 'inFolder', message: 'Create folder for component?' },
			{
				type: 'list',
				name: 'casing',
				message: 'Casing',
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
		])
		.then((result: any) => {
			if (result.defaultPath) {
				delete result['defaultPath'];
				result.path = 'src/components';
			}

			if (
				result.fileNamePostfix?.toLowerCase() === 'n' ||
				result.fileNamePostfix?.toLowerCase() === 'no'
			) {
				delete result.fileNamePostfix;
			}

			return result;
		});
}

function style(scope: scope) {
	return inquirer
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
				when: result => cssStyleTypes.some(type => result.type === type),
			},
			{
				type: 'list',
				name: 'naming',
				message: 'Style file naming',
				choices: [{ name: 'Component name', value: 'componentName' }, 'style', 'other'],
			},
			{
				type: 'input',
				name: 'customStyleNaming',
				message: 'Input style file name',
				when: result => result.naming === 'other',
			},
		])
		.then(result => {
			if (result.customStyleNaming) {
				result.naming = result.customStyleNaming;
				delete result.customStyleNaming;
			}

			return result;
		});
}

async function Init() {
	try {
		const config: { [key: string]: any } = {};
		const parts = [
			{ name: 'project', prompt: project },
			{ name: 'component', prompt: component },
			{ name: 'style', prompt: style },
		];
		const { scope } = await inquirer.prompt([
			{
				type: 'list',
				name: 'scope',
				message: 'For what scope you want to make configuration?',
				choices: ['global', 'project'],
			},
		]);

		for (const part of parts) {
			config[part.name] = await part.prompt(scope);
		}

		configService.create(config, scope);
	} catch (error) {
		if (error.isTtyError) {
			console.log("Couldn't be rendered in the current environment");
		} else {
			console.log(error);
		}
	}
}

export default Init;
