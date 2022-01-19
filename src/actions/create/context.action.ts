// Libs
import fs from 'fs';
import casing from 'case';
import { exec } from 'child_process';
import { merge } from 'lodash';

// Helpers
import FilePath from '../../file-path';
import { handleFileCheck, handlePathCheck } from '../../utils/path';
import { formatTemplate } from '../../utils/template';

// Configuration
import { getSourcePath, loadScopeConfiguration } from '../../configuration';

// Templates
import ContextTemplate from '../../templates/context/context.template';

// Types
import { ContextConfig } from '../../configuration';

// Base
import BaseAction from '../base.action';

interface Inputs {
	name: string;
}

interface Options {
	typescript: boolean;
	path: string;
	customProvider: boolean;
}

class CreateContextAction extends BaseAction {
	async handle(inputs?: Inputs, options?: Options) {
		const config = merge(loadScopeConfiguration('context'), options) as ContextConfig;

		const name = !inputs!.name.toLowerCase().endsWith('context')
			? `${inputs!.name}Context`
			: inputs!.name;

		const filePath = new FilePath({
			name: inputs?.name,
			fileExtension:
				(config.typescript ? 'ts' : 'js') + (config.customProvider ? 'x' : ''),
			sourcePath: getSourcePath(),
			namePlaceholders: {
				'{type}': 'context',
			},
			config: config,
		});

		await handlePathCheck(filePath.baseDir);
		await handleFileCheck(filePath.full);

		if (config.inFolder) {
			this.createFolder(filePath.dir);
		}

		const template = new ContextTemplate(casing.pascal(name), config).build();

		await this.create(filePath.full, formatTemplate(template));

		if (config.open) {
			exec(filePath.full);
		}
	}

	private createFolder(path: string) {
		if (fs.existsSync(path)) {
			return;
		}

		fs.mkdirSync(path);
	}
}

export default CreateContextAction;
