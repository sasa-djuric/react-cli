// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import { fixRelativePath, handlePathCheck } from '../../utils/path';
import { merge } from '../../utils/object';
import FilePath from '../../file-path';

// Configuration
import {
	getSourcePath,
	loadScopeConfiguration,
	StorybookConfig,
} from '../../configuration';

// Templates
import StorybookTemplate from '../../templates/story/story.template';

// Types
import Dictionary from '../../types/dictionary';

// Base
import BaseAction from '../base.action';

export interface StorybookInputs {
	name?: string;
	componentName: string;
	filePath: string;
	nameTypes?: Dictionary<string>;
	postfixTypes?: Dictionary<string>;
	configOverride?: StorybookConfig;
}

class CreateStoryAction extends BaseAction {
	async handle(inputs?: StorybookInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('storybook')
		) as StorybookConfig;

		const filePath = new FilePath({
			config: config,
			relativeToFilePath: path.parse(inputs!.filePath).dir,
			name: inputs!.name || inputs!.componentName,
			nameTypes: Object.assign({}, inputs!.nameTypes),
			pathTypes: { '{componentPath}': path.parse(inputs!.filePath).dir },
			postfixTypes: inputs!.postfixTypes,
			sourcePath: getSourcePath(),
			fileExtension: config.typescript ? 'ts' : 'js',
		});

		const relativeImportPath = path.join(
			path.relative(filePath.dir, path.parse(inputs!.filePath).dir),
			path.parse(inputs!.filePath).base
		);

		const template = new StorybookTemplate(
			inputs!.componentName,
			fixRelativePath(relativeImportPath),
			config
		).build();

		await handlePathCheck(filePath.dir);

		fs.writeFileSync(filePath.full, template.toString(), {
			encoding: 'utf-8',
		});
	}
}

export default CreateStoryAction;
