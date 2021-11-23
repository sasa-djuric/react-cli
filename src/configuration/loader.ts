// Libs
import fs from 'fs';
import path from 'path';
import { omit } from 'lodash';

// Helpers
import { merge } from '../utils/object';
import { getProjectRoot } from '../utils/path';

// Constants
import settings from '../settings';
import { defaultConfiguration } from './defaults';

// Types
import Dictionary from '../types/dictionary';
import { ComponentConfig, Config } from './configuration';

const fileName = `${settings.CONFIG_NAME}.json`;
const globalPath = path.resolve(settings.ROOT_PATH, fileName);

let config: Config;

export function doesLocalExist() {
	try {
		const localPath = path.resolve(getProjectRoot(), fileName);
		return fs.existsSync(localPath);
	} catch {
		return false;
	}
}

export function doesGlobalExist() {
	try {
		return fs.existsSync(globalPath);
	} catch {
		return false;
	}
}

function _loadGlobal(): Config {
	return JSON.parse(fs.readFileSync(globalPath, { encoding: 'utf8' }));
}

function _loadLocal(): Config {
	const localPath = path.resolve(getProjectRoot(), fileName);
	return JSON.parse(fs.readFileSync(localPath, { encoding: 'utf8' }));
}

function _handleMerge(config: Config): Config {
	const mergeConfig = omit(config.project, ['path']);

	return {
		...config,
		component: Object.entries(config.component).reduce(
			(acc: Config['component'], [key, cur]: [string, ComponentConfig]) => {
				return {
					...acc,
					[key]: merge(cur, mergeConfig),
				};
			},
			{}
		),
		style: merge(config.style || defaultConfiguration.style, mergeConfig),
		storybook: merge(config.storybook || defaultConfiguration.storybook, mergeConfig),
		test: merge(config.test || defaultConfiguration.test, mergeConfig),
		hook: merge(config.hook || defaultConfiguration.hook, mergeConfig),
	};
}

export function loadConfiguration(): Config {
	if (config) {
		return config;
	} else if (doesLocalExist()) {
		config = _handleMerge(_loadLocal());
	} else if (doesGlobalExist()) {
		config = _handleMerge(_loadGlobal());
	} else {
		config = _handleMerge(defaultConfiguration);
	}

	return config;
}

export function loadScopeConfiguration<T extends keyof Config>(
	scope: T,
	override?: Dictionary<any>
): Config[T] {
	const config = loadConfiguration()[scope];

	if (override) {
		return merge(override, config) as Config[T];
	}

	return config;
}

export function doesConfigurationFileExists() {
	if (doesLocalExist()) {
		return true;
	} else if (doesGlobalExist()) {
		return true;
	}

	return false;
}

export function getSourcePath() {
	const srcPath = loadConfiguration().project.path;
	const projectPath = getProjectRoot();

	return path.join(projectPath, srcPath);
}
