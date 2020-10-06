// Libs
import inquirer from 'inquirer';
import path from 'path';
import { projectTypes, styleTypes } from '../constants';
import { Config } from '../types/config';

// Utils
import { parseOptions, saveFile } from '../utils';

const defaultConfig: Config = {
	project: {
		type: 'cra',
		typescript: false,
	},
	component: {
		path: 'src/components',
		withStyle: true,
		withStroy: false,
		withTest: false,
		withProptypes: false,
		withIndex: true,
		inFolder: true,
		casing: 'snake',
		naming: 'name',
	},
	style: {
		type: 'scss',
		modules: true,
	},
};

function project() {
	return inquirer
		.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'Project type',
				choices: projectTypes.map(type => type.label),
			},
			{ type: 'confirm', name: 'typescript', message: 'Using typescript' },
		])
		.then(result => {
			result.type = projectTypes.find(type => type.label === result.type)?.name;
			return result;
		});
}

function component() {
	return inquirer
		.prompt([
			{ type: 'confirm', name: 'defaultPath', message: 'Component path src/components' },
			{ type: 'input', name: 'path', message: 'Component path', when: answers => !answers.defaultPath },
			{ type: 'confirm', name: 'withStyle', message: 'Create style file' },
			{ type: 'confirm', name: 'withStroy', message: 'Create story file' },
			{ type: 'confirm', name: 'withTest', message: 'Create test file' },
			{ type: 'confirm', name: 'withProptypes', message: 'Use proptypes' },
			{ type: 'confirm', name: 'withIndex', message: 'Create index export file' },
			{ type: 'confirm', name: 'inFloder', message: 'Create folder for component' },
			{ type: 'list', name: 'casing', choices: ['kebab', 'snake', 'camel', 'pascal'] },
			{ type: 'list', name: 'naming', choices: ['name', 'index'] },
		])
		.then((results: any) => {
			if (results.defaultPath) {
				delete results['defaultPath'];
				results['path'] = 'src/components';
			}

			return results;
		});
}

function style() {
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

async function Init(args: []) {
	const config: { [key: string]: any } = {};
	const options = parseOptions(args);

	const parts = [
		{ name: 'project', prompt: project },
		{ name: 'component', prompt: component },
		{ name: 'style', prompt: style },
	];

	for (const part of parts) {
		await part
			.prompt()
			.then((answers: { [key: string]: any }) => {
				config[part.name] = answers;
			})
			.catch((error: any) => {
				if (error.isTtyError) {
					// Prompt couldn't be rendered in the current environment
					console.log('err');
				} else {
					// Something else when wrong
					console.log('error');
				}

				process.exit();
			});
	}

	console.log(config);

	saveFile(path.resolve(__dirname, 'react-config.json'), config);
}

export default Init;
