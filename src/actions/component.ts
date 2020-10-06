import fs from 'fs';
import path from 'path';
import casing from 'case';

// Utils
import { makeIndexFileExport } from '../utils';

// Services
import templateService from '../services/template';

// Constants
import { config } from '../constants';
import styleService from '../services/style';

function checkSubFolders(mainPath: string, subFolders: string[]) {
	let lastPath = mainPath;

	for (const folder of subFolders) {
		if (!fs.existsSync(path.resolve(lastPath, folder))) {
			fs.mkdirSync(path.resolve(lastPath, folder));
		}

		lastPath = lastPath + '/' + folder;
	}
}

function create(name: string, options: { [key: string]: boolean }) {
	const componentName = name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
	const namePascal = casing.pascal(componentName);
	const namePreferred = casing[config.component.casing](componentName);
	const subFolders = name.split('/').slice(0, name.split('/').length - 1);
	const componentPath = path.resolve(
		config.component.path,
		...subFolders,
		config.component.inFolder ? namePreferred : ''
	);
	const template = templateService.component.create(componentName, options);

	try {
		checkSubFolders(config.component.path, subFolders);
	} catch (err) {
		return;
	}

	if (config.component.inFolder) {
		fs.mkdirSync(path.resolve(config.component.path, ...subFolders, namePreferred));
	}

	fs.writeFileSync(
		path.resolve(componentPath, namePreferred + (config.project.typescript ? '.tsx' : '.jsx')),
		template,
		{ encoding: 'utf-8' }
	);

	if (config.component.withStyle) {
		styleService.create(namePreferred, config.style, componentPath);
	}

	if (config.component.withIndex) {
		makeIndexFileExport(
			componentPath,
			namePascal,
			namePreferred,
			config.project.typescript ? 'ts' : 'js'
		);
	}
}

function _delete(params: any) {
	console.log('delete component');
}

function rename(params: any) {
	console.log('rename component');
}

export default { create, delete: _delete, rename };
