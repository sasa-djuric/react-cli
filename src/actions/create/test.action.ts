// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import FilePath from '../../file-path';
import { handlePathCheck, fixRelativePath } from '../../utils/path';
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
			relativeToFilePath: path.parse(inputs!.filePath).dir,
			nameTypes: Object.assign({}, inputs!.nameTypes, { '{type}': 'test' }),
			pathTypes: { '{componentPath}': path.parse(inputs!.filePath).dir },
			postfixTypes: inputs!.postfixTypes,
			sourcePath: getSourcePath(),
			fileExtension: config.typescript ? 'ts' : 'js',
		});

		const relativeImportPath = path.join(
			path.relative(filePath.dir, path.parse(inputs!.filePath).dir),
			path.basename(inputs!.filePath)
		);

		const template = new TestTemplate(
			inputs!.componentName,
			fixRelativePath(relativeImportPath),
			config
		).build();

		await handlePathCheck(filePath.dir);

		fs.writeFileSync(filePath.full, template.toString(), { encoding: 'utf-8' });
	}
}

export default CreateTestAction;
