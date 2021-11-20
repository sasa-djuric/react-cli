// Types
import Dictionary from '../types/dictionary';

// Helpers
import { loadScopeConfiguration } from '../configuration';
import { format } from '../utils/format';
import { lint as _lint } from '../utils/lint';

abstract class BaseAction {
	abstract handle(inputs?: Dictionary<any>, options?: Dictionary<any>): void;

	async lint(filePath: string) {
		const projectConfig = loadScopeConfiguration('project');

		if (projectConfig.lint) {
			await _lint(filePath);
		}

		if (projectConfig.format) {
			await format(filePath);
		}
	}
}

export default BaseAction;
