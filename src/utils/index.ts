import fs from 'fs';
import path from 'path';
import { Config } from '../types/config';

export function parseOptions(args: any) {
	return Object.values(args.options).reduce((acc: any, optionConfig: any) => {
		const option: string = optionConfig.long.replace('--', '');
		return args[option] ? { ...acc, [option]: true } : acc;
	}, {});
}

export function haveOption(option: never, options: []) {
	return options.indexOf(option) >= 0;
}

export function saveFile(path: string, content: string | object) {
	let finalContent: string;

	if (typeof content === 'object') {
		finalContent = JSON.stringify(content, null, 4);
	} else {
		finalContent = content;
	}

	fs.writeFileSync(path, finalContent, { encoding: 'utf8' });
}

export function getConfig(): Config {
	return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'react-config.json'), { encoding: 'utf8' }));
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
