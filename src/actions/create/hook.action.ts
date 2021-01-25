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
		const filePath = new FilePath({
			name: inputs!.name,
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

		const template = new HookTemplate(inputs!.name, config.typescript).build();

		fs.writeFileSync(filePath.full, template.toString(), { encoding: 'utf8' });

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
