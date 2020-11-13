import { getProjectRoot } from '.';
import path from 'path';
import fs from 'fs';

function getAll() {
	try {
		const packageFile = path.resolve(getProjectRoot(), 'package.json');
		const packageJson = JSON.parse(fs.readFileSync(packageFile, { encoding: 'utf-8' }));

		return { ...packageJson.dependencies, ...packageJson.devDependencies };
	} catch (err) {
		return {};
	}
}

function getVersion(dependency: string) {
	try {
		return getAll()[dependency];
	} catch {
		return;
	}
}

function exists(dependency: string) {
	try {
		return !!getVersion(dependency);
	} catch {
		return false;
	}
}

export default { getAll, getVersion, exists };
