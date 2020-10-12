// Libs
import inquirer from 'inquirer';

// Constants
import { projectTypes, styleTypes } from '../constants';

// Services
import configService from '../services/config';

// Types
import { scope } from '../types';

function project(scope: scope) {
	return inquirer
		.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Project type',
				choices: projectTypes.map(type => type.label),
			},
			{
				type: 'confirm',
				name: 'typescript',
				message: 'Using typescript?',
				when: () => scope === 'global',
			},
		])
		.then(result => {
			result.type = projectTypes.find(type => type.label === result.type)?.name;
			return result;
		});
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
			{ type: 'confirm', name: 'index', message: 'Create index export file?' },
			{ type: 'confirm', name: 'inFolder', message: 'Create folder for component?' },
			{ type: 'list', name: 'casing', choices: ['kebab', 'snake', 'camel', 'pascal'] },
			{ type: 'list', name: 'naming', choices: ['name', 'index'] },
			{
				type: 'confirm',
				name: 'open',
				message: 'Open component file in default editor after creating?',
			},
		])
		.then((results: any) => {
			if (results.defaultPath) {
				delete results['defaultPath'];
				results['path'] = 'src/components';
			}

			return results;
		});
}

function style(scope: scope) {
	return inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'Styling type',
			choices: styleTypes,
		},
		{ type: 'confirm', name: 'modules', message: 'Use modules' },
	]);
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
