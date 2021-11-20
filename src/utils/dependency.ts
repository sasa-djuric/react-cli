// Libs
import path from 'path';
import fs from 'fs';

// Helpers
import { getProjectRoot } from './path';

export function getPackageJson() {
	try {
		const packageFile = path.resolve(getProjectRoot(), 'package.json');
		const packageJson = JSON.parse(
			fs.readFileSync(packageFile, { encoding: 'utf-8' })
		);

		return packageJson;
	} catch (err) {
		return {};
	}
}

export function getAllDependencies() {
	try {
		const packageJson = getPackageJson();
		return { ...packageJson.dependencies, ...packageJson.devDependencies };
	} catch (err) {
		return {};
	}
}

export function getDependencyVersion(dependency: string) {
	try {
		const dependencies = getAllDependencies();
		const dep = dependencies[dependency].replace(/\^/g, '');

		if (dep.match(/\./g).length > 1) {
			const firstDotIndex = dep.indexOf('.');
			const int = dep.replace(/\./g, '');

			return parseFloat(
				int.substr(0, firstDotIndex) + '.' + int.substr(firstDotIndex)
			);
		}

		return parseFloat(dep);
	} catch {
		return;
	}
}

export function doesDependencyExists(dependency: string) {
	try {
		const dependencies = getAllDependencies();
		return !!dependencies[dependency];
	} catch {
		return false;
	}
}
