// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Types
import { styleType } from '../types/config';

function create(name: string, config: { modules: boolean; type: styleType }, filePath: string) {
	if (config.type === 'styled-components') return;
	const draft = `.${casing.kebab(name)} {\n   \n}`;
	const styles: { [key: string]: { template: string; extension: string } } = {
		css: {
			template: draft,
			extension: '.css',
		},
		scss: {
			template: draft,
			extension: '.scss',
		},
		saas: {
			template: `.${casing.kebab(name)}\n		`,
			extension: '.saas',
		},
		less: {
			template: draft,
			extension: '.less',
		},
	};
	const filename = name + (config.modules ? '.module' : '') + styles[config.type].extension;
	const template = styles[config.type].template;

	fs.writeFileSync(path.resolve(filePath, filename), template, { encoding: 'utf-8' });
}

export default { create };
