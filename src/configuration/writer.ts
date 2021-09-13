// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import { merge } from '../utils/object';
import { getProjectRoot } from '../utils/path';

// Constants
import settings from '../settings';
import { defaultConfiguration } from './defaults';

export function createConfigurationFile(config: any, scope: 'global' | 'project') {
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
