// Libs
import path from 'path';

// Constants
import { cssStyleTypes } from '../../constants';

// Helpers
import { fixRelativePath, handlePathCheck } from '../../utils/path';
import { merge } from '../../utils/object';
import { formatTemplate } from '../../utils/template';
import FilePath from '../../file-path';

// Configuration
import { getSourcePath, loadScopeConfiguration, StyleConfig } from '../../configuration';

// Templates
import StyleTemplate from '../../templates/style/style.template';
import StyledComponentsStyleTypeTemplate from '../../templates/style/styled-components.style.type.template';
import CSSStyleTypeTemplate from '../../templates/style/css.style.type.template';

// Types
import Dictionary from '../../types/dictionary';

// Base
import BaseAction from '../base.action';

export interface StyleInputs {
	name: string;
	filePath: string;
	fileName: string;
	namePlaceholders?: Dictionary<string>;
	template: string;
	configOverride?: StyleConfig;
}

class CreateStyleAction extends BaseAction {
	async handle(inputs: StyleInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('style')
		) as StyleConfig;
		const stylingType = cssStyleTypes.some((value) => config.type === value)
			? 'css'
			: 'js';
		const jsTypeExtension = config.typescript ? 'ts' : 'js';
		const fileExtension = stylingType === 'js' ? jsTypeExtension : config.type;

		if (
			stylingType === 'css' &&
			config.modules &&
			!config.fileNaming.name.endsWith('.module')
		) {
			config.fileNaming.name += '.module';
		}

		const filePath = new FilePath({
			name: inputs!.name,
			config: config,
			relativeToFilePath: inputs!.filePath,
			pathPlaceholders: {
				'{componentPath}': inputs!.filePath,
			},
			sourcePath: getSourcePath(),
			namePlaceholders: {
				...(inputs!.namePlaceholders || {}),
				'{type}': 'style',
			},
			fileExtension: fileExtension,
		});

		const StyleTypeTemplate =
			stylingType === 'js'
				? StyledComponentsStyleTypeTemplate
				: CSSStyleTypeTemplate;

		const template = new StyleTemplate(
			inputs!.name,
			config,
			// @ts-ignore
			StyleTypeTemplate
		);

		await handlePathCheck(filePath.dir);

		const importPath = fixRelativePath(
			path.join(path.relative(inputs.filePath, filePath.baseDir), filePath.base)
		);
		const componentTemplate = template.include(inputs.template, importPath);
		const componentFilePath = path.join(inputs.filePath, inputs.fileName);

		await this.create(filePath.full, formatTemplate(template.build()));
		await this.update(componentFilePath, formatTemplate(componentTemplate));
	}
}

export default CreateStyleAction;
