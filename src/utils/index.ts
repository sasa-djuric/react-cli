import fs from 'fs';
import path from 'path';

export function makeIndexFileExport(
	filePath: string,
	importName: string,
	fileName: string,
	extension: string = 'js'
) {
	const template = `import ${importName} from './${fileName}';\n\nexport default ${importName};`;
	fs.writeFileSync(path.resolve(filePath, `index.${extension}`), template, {
		encoding: 'utf-8',
	});
}

export function conditionalString(condition: any, result?: string) {
	return condition ? (result ? result : condition) : '';
}

export function getProjectRoot() {
	const currentPath = process.cwd();
	const directories = currentPath.split(path.sep);

	for (let i = 0; i < directories.length; i++) {
		const currentPath = directories.join(path.sep);

		if (fs.existsSync(path.resolve(currentPath, 'package.json'))) {
			return currentPath;
		}

		directories.pop();
	}

	throw new Error('Project not found');
}
