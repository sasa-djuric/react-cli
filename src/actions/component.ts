import fs from 'fs';
import path from 'path';
import casing from 'case';
import { exec } from 'child_process';

// Types
import { Options, Constraints } from '../types/index';

// Utils
import { featureToggle, getProjectRoot, makeIndexFileExport } from '../utils';

// Services
import styleService from '../services/style';
import testService from '../services/test';
import componentService from '../services/component';
import storyService from '../services/story';
import configService from '../services/config';

function checkSubFolders(mainPath: string, subFolders: string[]) {
	let lastPath = mainPath;

	for (const folder of subFolders) {
		if (!fs.existsSync(path.resolve(lastPath, folder))) {
			fs.mkdirSync(path.resolve(lastPath, folder));
		}

		lastPath = lastPath + '/' + folder;
	}
}

function create(name: string, options: Options, constraints: Constraints) {
	const config = configService.get();
	const componentName = name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
	const namePascal = casing.pascal(componentName);
	const namePreferred = casing[config.component.casing](componentName);
	const subFolders = name.split('/').slice(0, name.split('/').length - 1);
	const componentPath = path.resolve(
		getProjectRoot(),
		options.path || config.component.path,
		...subFolders,
		config.component.inFolder ? namePreferred : ''
	);
	const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
	const filePath = path.resolve(componentPath, name + fileExtension);
	const feature = featureToggle('component', config, options, constraints);

	try {
		checkSubFolders(path.resolve(getProjectRoot(), config.component.path), subFolders);

		feature('inFolder', () => {
			fs.mkdirSync(componentPath);
		});

		componentService.create(namePreferred, componentPath, options, constraints, config);

		feature('style', () => {
			styleService.create(namePreferred, config.style, componentPath);
		});
		feature('index', () => {
			makeIndexFileExport(
				componentPath,
				namePascal,
				namePreferred,
				config.project.typescript ? 'ts' : 'js'
			);
		});
		feature('test', () => {
			testService.create(namePreferred, componentPath, {
				...config.testing,
				typescript: config.project.typescript,
			});
		});
		feature('story', () => {
			storyService.create(namePreferred, { typescript: config.project.typescript }, componentPath);
		});
		feature('open', () => {
			exec(filePath);
		});
	} catch (err) {
		console.log(err);
	}
}

function _delete(params: any) {
	console.log('delete component');
}

function rename(params: any) {
	console.log('rename component');
}

export default { create, delete: _delete, rename };
