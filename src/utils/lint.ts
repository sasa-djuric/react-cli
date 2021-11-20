import path from 'path';
import { exec } from 'child_process';
import { getPackageJson } from './dependency';
import { fileExists } from './file';
import { getProjectRoot } from './path';

async function usesEsLint() {
	const projectRoot = getProjectRoot();

	const files = [
		'.eslintrc.js',
		'.eslintrc.cjs',
		'.eslintrc.yaml',
		'.eslintrc.yml',
		'.eslintrc.json',
	];

	const promises: Array<Promise<boolean>> = files.map((file) => {
		return fileExists(path.join(projectRoot, file));
	});

	promises.push(Promise.resolve(!!getPackageJson().eslintConfig));

	return (await Promise.all(promises)).some((result) => result);
}

export async function lint(filePath: string) {
	if (await usesEsLint()) {
		return new Promise<void>((resolve) =>
			exec(`npx eslint ${filePath}`, () => resolve())
		);
	}
}
