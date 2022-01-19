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
import HookTemplate from '../../templates/hook/hook.template';

// Types
import { HookConfig } from '../../configuration';

// Base
import BaseAction from '../base.action';

interface Inputs {
	name: string;
}

interface Options {
	typescript: boolean;
	path: string;
}

class CreateHookAction extends BaseAction {
	async handle(inputs?: Inputs, options?: Options) {
		const config = merge(options, loadScopeConfiguration('hook')) as HookConfig;

		const name = !inputs!.name.startsWith('use')
			? `use-${inputs!.name}`
			: inputs!.name;

		const filePath = new FilePath({
			name,
			fileExtension: config.typescript ? 'ts' : 'js',
			sourcePath: getSourcePath(),
			namePlaceholders: {
				'{type}': 'hook',
			},
			config: config,
		});

		await handlePathCheck(filePath.baseDir);
		await handleFileCheck(filePath.full);

		if (config.inFolder) {
			this.createFolder(filePath.dir);
		}

		const template = new HookTemplate(casing.camel(name), config).build();

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

export default CreateHookAction;
