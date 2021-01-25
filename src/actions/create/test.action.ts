// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import FilePath from '../../file-path';
import { handlePathCheck } from '../../utils/path';
import { merge } from '../../utils/object';

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
	filePath: string;
	nameTypes?: Dictionary<string>;
	postfixTypes?: Dictionary<string>;
	configOverride?: TestConfig;
}

class CreateTestAction extends BaseAction {
	async handle(inputs?: TestInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('test')
		) as TestConfig;

		const filePath = new FilePath({
			name: inputs!.name || inputs!.componentName,
			config: config,
			relativeToFilePath: inputs!.filePath,
			nameTypes: Object.assign({}, inputs!.nameTypes, { '{type}': 'test' }),
			pathTypes: { '{componentPath}': inputs!.filePath },
			postfixTypes: inputs!.postfixTypes,
			sourcePath: getSourcePath(),
			fileExtension: config.typescript ? 'ts' : 'js',
		});

		const relativeImportPath = path.join(
			path.relative(path.dirname(filePath.dir), path.dirname(inputs!.filePath)),
			inputs!.componentName
		);

		const template = new TestTemplate(
			inputs!.componentName,
			relativeImportPath,
			config
		).build();

		await handlePathCheck(filePath.dir);

		fs.writeFileSync(filePath.full, template.toString(), { encoding: 'utf-8' });
	}
}

export default CreateTestAction;
