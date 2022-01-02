// Libs
import fs from 'fs/promises';

// Types
import Dictionary from '../types/dictionary';

// Helpers
import { loadScopeConfiguration } from '../configuration';
import { format } from '../utils/format';
import { lint as _lint } from '../utils/lint';
import { createMessage, updateMessage } from '../ui/messages';

abstract class BaseAction {
	private readonly projectConfig = loadScopeConfiguration('project');

	abstract handle(inputs?: Dictionary<any>, options?: Dictionary<any>): void;

	private async lint(filePath: string) {
		if (this.projectConfig.lint) {
			await _lint(filePath);
		}

		if (this.projectConfig.format) {
			await format(filePath);
		}
	}

	public async create(absolutePath: string, template: string) {
		await fs.writeFile(absolutePath, template, { encoding: 'utf-8' });
		await this.lint(absolutePath);

		if (this.projectConfig.verbose) {
			createMessage(absolutePath);
		}
	}

	public async update(absolutePath: string, template: string) {
		try {
			await fs.unlink(absolutePath);
		} catch {}

		await fs.writeFile(absolutePath, template, { encoding: 'utf-8' });
		await this.lint(absolutePath);

		if (this.projectConfig.verbose) {
			updateMessage(absolutePath);
		}
	}
}

export default BaseAction;
