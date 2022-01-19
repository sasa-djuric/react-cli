// Libs
import path from 'path';

// Helpers
import FilePath from '../../file-path';
import { handlePathCheck, fixRelativePath, removeExtension } from '../../utils/path';
import { merge } from '../../utils/object';
import { formatTemplate } from '../../utils/template';

// Configuration
import { getSourcePath, loadScopeConfiguration, TestConfig } from '../../configuration';

// Templates
import TestTemplate from '../../templates/test/test.template';

// Types
import Dictionary from '../../types/dictionary';

// Base
import BaseAction from '../base.action';

export interface TestInputs {
	name?: string;
	componentName: string;
	componentDefaultImport: boolean;
	filePath: string;
	namePlaceholders?: Dictionary<string>;
	configOverride?: TestConfig;
}

class CreateTestAction extends BaseAction {
	async handle(inputs: TestInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('test')
		) as TestConfig;

		const filePath = new FilePath({
			name: inputs!.name || inputs!.componentName,
			config: config,
			relativeToFilePath: path.parse(inputs!.filePath).dir,
			namePlaceholders: Object.assign({}, inputs!.namePlaceholders, {
				'{type}': 'test',
			}),
			pathTypes: {
				'{componentPath}': path.parse(inputs!.filePath).dir,
			},
			sourcePath: getSourcePath(),
			fileExtension: config.typescript ? 'tsx' : 'jsx',
		});

		const relativeImportPath = removeExtension(
			path.join(
				path.relative(filePath.dir, path.parse(inputs!.filePath).dir),
				path.basename(inputs!.filePath)
			)
		);

		const template = new TestTemplate(
			inputs!.componentName,
			fixRelativePath(relativeImportPath),
			config,
			inputs.componentDefaultImport
		).build();

		await handlePathCheck(filePath.dir);
		await this.create(filePath.full, formatTemplate(template));
	}
}

export default CreateTestAction;
