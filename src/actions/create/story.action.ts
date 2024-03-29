// Libs
import path from 'path';

// Helpers
import { fixRelativePath, handlePathCheck, removeExtension } from '../../utils/path';
import { merge } from '../../utils/object';
import { formatTemplate } from '../../utils/template';
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
	componentDefaultImport: boolean;
	componentType: string;
	filePath: string;
	namePlaceholders?: Dictionary<string>;
	configOverride?: StorybookConfig;
}

class CreateStoryAction extends BaseAction {
	async handle(inputs: StorybookInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('storybook')
		) as StorybookConfig;

		const filePath = new FilePath({
			config: config,
			relativeToFilePath: path.parse(inputs!.filePath).dir,
			name: inputs!.name || inputs!.componentName,
			namePlaceholders: Object.assign({}, inputs!.namePlaceholders),
			pathPlaceholders: {
				'{componentPath}': path.parse(inputs!.filePath).dir,
			},
			sourcePath: getSourcePath(),
			fileExtension: config.typescript ? 'tsx' : 'jsx',
		});

		const relativeImportPath = removeExtension(
			path.join(
				path.relative(filePath.dir, path.parse(inputs!.filePath).dir),
				path.parse(inputs!.filePath).base
			)
		);

		const template = new StorybookTemplate(
			inputs!.componentName,
			fixRelativePath(relativeImportPath),
			config,
			inputs?.componentDefaultImport,
			inputs.componentType === 'default' ? 'component' : inputs.componentType
		).build();

		await handlePathCheck(filePath.dir);
		await this.create(filePath.full, formatTemplate(template));
	}
}

export default CreateStoryAction;
