import fs from 'fs';
import path from 'path';
import casing from 'case';
import { exec } from 'child_process';

// Libs
import inquirer from 'inquirer';

// Errors
import PathError from '../errors/path-error';

// Types
import { Options, Constraints } from '../types/index';

// Utils
import { getProjectRoot, makeIndexFileExport } from '../utils';
import featureToggling from '../utils/feature-toggling';

// Services
import styleService from '../services/style';
import testService from '../services/test';
import componentService, { Feature as ComponentFeature } from '../services/component';
import storyService from '../services/story';
import configService from '../services/config';

function _checkSubFolders(mainPath: string, subFolders: string[]) {
	let lastPath = mainPath;

	for (const folder of subFolders) {
		if (!fs.existsSync(path.resolve(lastPath, folder))) {
			fs.mkdirSync(path.resolve(lastPath, folder));
		}

		lastPath = lastPath + '/' + folder;
	}
}

function _shouldCreateDirectory(directory: string) {
	return inquirer
		.prompt({
			name: 'shouldCreate',
			type: 'confirm',
			message: `${directory} does not exist. Do you want to create it?`,
		})
		.then((result) => result.shouldCreate);
}

function _handlePath(pathForCheck: string) {
	if (fs.existsSync(path.resolve(pathForCheck))) {
		return Promise.resolve(true);
	} else if (fs.existsSync(path.resolve(pathForCheck, '../'))) {
		return _shouldCreateDirectory(path.basename(pathForCheck)).then((shouldCreate) => {
			if (shouldCreate) {
				fs.mkdirSync(pathForCheck);

				return true;
			}

			throw new PathError();
		});
	}

	return Promise.reject(new PathError());
}

async function create(name: string, options: Options, constraints: Constraints, type: string) {
	const config = configService.get();
	const componentTypeConfig = config[type];
	const componentName =
		name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
	const namePascal = casing.pascal(componentName);
	const namePreferred = casing[componentTypeConfig.casing](componentName);
	const subFolders = name.split('/').slice(0, name.split('/').length - 1);
	const componentPath = path.resolve(
		getProjectRoot(),
		config.project.path,
		options.path || componentTypeConfig.directory,
		...subFolders,
		componentTypeConfig.inFolder ? namePreferred : ''
	);
	const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
	const filePath = path.resolve(
		componentPath,
		name + (componentTypeConfig.fileNamePostfix || '') + fileExtension
	);
	const feature = featureToggling.toggle('component', config, options, constraints);

	try {
		await _handlePath(path.resolve(componentPath, '../'));

		_checkSubFolders(
			path.resolve(getProjectRoot(), config.project.path, componentTypeConfig.directory),
			subFolders
		);

		feature(ComponentFeature.InFolder, () => {
			fs.mkdirSync(componentPath);
		});

		componentService.create(namePreferred, componentPath, options, constraints, config);

		feature(ComponentFeature.Style, () => {
			styleService.create(namePreferred, config.style, componentPath);
		});

		feature(ComponentFeature.Index, () => {
			makeIndexFileExport(
				componentPath,
				namePascal,
				namePreferred + (componentTypeConfig.fileNamePostfix || ''),
				config.project.typescript ? 'ts' : 'js'
			);
		});

		feature(ComponentFeature.Test, () => {
			testService.create(namePreferred, componentPath, {
				...config.testing,
				typescript: config.project.typescript,
			});
		});

		feature(ComponentFeature.Story, () => {
			storyService.create(
				namePreferred,
				{ typescript: config.project.typescript },
				componentPath
			);
		});

		feature(ComponentFeature.Open, () => {
			exec(filePath);
		});
	} catch (err) {
		console.log(err.message);
	}
}

export default { create };
