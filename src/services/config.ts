import fs from 'fs';
import path from 'path';
import settings from '../settings';
import { Config } from '../types/config';
import { getProjectRoot } from '../utils';
import { defaultConfig } from '../constants';

function _detectTypescript() {
	return fs.existsSync(path.resolve(getProjectRoot(), 'tsconfig.json'));
}

function _adjustConfig(config: Config) {
	config.component.typescript = config.project.typescript;

	return config;
}

function get(): Config {
	const fileName = 'react-config.json';
	const global = path.resolve(settings.ROOT_PATH, fileName);
	const local = path.resolve(getProjectRoot(), fileName);

	if (fs.existsSync(local)) {
		return _adjustConfig(JSON.parse(fs.readFileSync(local, { encoding: 'utf8' })));
	} else if (fs.existsSync(global)) {
		return _adjustConfig(JSON.parse(fs.readFileSync(global, { encoding: 'utf8' })));
	} else {
		return _adjustConfig(defaultConfig);
	}
}

function create(config: any, scope: 'global' | 'project') {
	const fileName = 'react-config.json';
	const global = path.resolve(settings.ROOT_PATH, fileName);
	const local = path.resolve(getProjectRoot(), fileName);

	if (scope === 'project') {
		config.project.typescript = _detectTypescript();
	}

	fs.writeFileSync(scope === 'global' ? global : local, JSON.stringify(config, null, 4), {
		encoding: 'utf-8',
	});
}

export default { create, get };
