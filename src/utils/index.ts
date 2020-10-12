import fs from 'fs';
import path from 'path';

export function parseOptions(args: any) {
	return Object.values(args.options).reduce((acc: any, optionConfig: any) => {
		const option: string = optionConfig.long.replace('--', '');

		if (option.startsWith('no-')) {
			return acc;
		}

		return args[option] ? { ...acc, [option]: args[option] } : acc;
	}, {});
}

export function parseConstraints(args: any) {
	return Object.values(args.parent.args).reduce((acc: any, arg: any) => {
		const option: string = arg.replace('--', '');

		if (!option.startsWith('no-')) {
			return acc;
		}

		return { ...acc, [option.replace('no-', '')]: true };
	}, {});
}

export function makeIndexFileExport(
	filePath: string,
	importName: string,
	fileName: string,
	extension: string = 'js'
) {
	const template = `import ${importName} from './${fileName}';\n\nexport default ${importName};`;
	fs.writeFileSync(path.resolve(filePath, `index.${extension}`), template, { encoding: 'utf-8' });
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

export function dependencyExists(dependency: string) {
	try {
		const packageFile = path.resolve(getProjectRoot(), 'package.json');
		const packageJson = JSON.parse(fs.readFileSync(packageFile, { encoding: 'utf-8' }));
		const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

		return !!Object.keys(dependencies).find(dep => dep.includes(dependency));
	} catch (err) {
		return;
	}
}

export function featureToggle(
	scope: 'project' | 'component' | 'style',
	config: any,
	options: any,
	constraints: any
) {
	return (name: string, fn: Function) => {
		if ((options[name] || config[scope][name]) && !constraints[name]) {
			fn();
		}
	};
}
