// Libs
import fs from 'fs';
import { exec } from 'child_process';

// Helpers
import FilePath from '../../file-path';
import { merge } from 'lodash';
import { handleFileCheck, handlePathCheck } from '../../utils/path';

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
			postfixTypes: { type: 'hook' },
			config: config,
		});

		await handlePathCheck(filePath.baseDir);
		await handleFileCheck(filePath.full);

		if (config.inFolder) {
			this.createFolder(filePath.dir);
		}

		const template = new HookTemplate(name, config.typescript).build();

		await this.create(filePath.full, template);

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
