import path from 'path';
import { exec } from 'child_process';
import { getPackageJson } from './dependency';
import { fileExists } from './file';
import { getProjectRoot } from './path';

async function usesPrettier() {
	const projectRoot = getProjectRoot();

	const files = [
		'.prettierrc.json',
		'.prettierrc.yml',
		'.prettierrc.yaml',
		'.prettierrc.json5',
		'.prettierrc.js',
		'.prettierrc.cjs',
		'.prettierrc.toml',
		'prettier.config.js',
		'prettier.config.cjs',
	];

	const promises: Array<Promise<boolean>> = files.map((file) => {
		return fileExists(path.join(projectRoot, file));
	});

	promises.push(Promise.resolve(!!getPackageJson().prettier));

	return (await Promise.all(promises)).some((result) => result);
}

export async function format(filePath: string) {
	if (await usesPrettier()) {
		return new Promise<void>((resolve) =>
			exec(`npx prettier --write ${filePath}`, () => resolve())
		);
	}
}
