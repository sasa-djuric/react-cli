// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import { merge } from '../utils/object';
import { getProjectRoot } from '../utils/path';

// Constants
import settings from '../settings';
import { defaultConfiguration } from './defaults';

// Types
import { Scope } from './';

export function createConfigurationFile(config: any, scope: Scope) {
	try {
		const fileName = `${settings.CONFIG_NAME}.json`;
		const global = path.resolve(settings.ROOT_PATH, fileName);
		const local = path.resolve(getProjectRoot(), fileName);
		const filePath = scope === 'global' ? global : local;
		const mergedConfig = merge(config, defaultConfiguration);

		fs.writeFileSync(filePath, JSON.stringify(mergedConfig, null, '\t'), {
			encoding: 'utf-8',
		});
	} catch (ex: any) {
		console.error(ex.message);
	}
}

export function updateConfigurationFile(config: any, scope: Scope) {
	const fileName = `${settings.CONFIG_NAME}.json`;
	const global = path.resolve(settings.ROOT_PATH, fileName);
	const local = path.resolve(getProjectRoot(), fileName);
	const filePath = scope === 'global' ? global : local;

	fs.unlinkSync(filePath);
	fs.writeFileSync(filePath, JSON.stringify(config, null, '\t'), {
		encoding: 'utf-8',
	});
}
