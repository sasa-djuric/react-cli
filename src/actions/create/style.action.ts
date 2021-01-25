// Libs
import fs from 'fs';

// Constants
import { cssStyleTypes } from '../../constants';

// Helpers
import { handlePathCheck } from '../../utils/path';
import { merge } from '../../utils/object';
import FilePath from '../../file-path';

// Buidlers
import JSTemplateBuilder from '../../builders/js-template.builder';

// Configuration
import { getSourcePath, loadScopeConfiguration, StyleConfig } from '../../configuration';

// Templates
import StyleTemplate from '../../templates/style/style.template';
import JSStyleTypeTemplate from '../../templates/style/styled-components.style.type.template';
import CSSStyleTypeTemplate from '../../templates/style/css.style.type.template';

// Types
import Dictionary from '../../types/dictionary';

// Base
import BaseAction from '../base.action';

export interface StyleInputs {
	name: string;
	filePath: string;
	nameTypes?: Dictionary<string>;
	postfixTypes?: Dictionary<string>;
	template?: JSTemplateBuilder;
	configOverride?: StyleConfig;
}

class CreateStyleAction extends BaseAction {
	async handle(inputs?: StyleInputs, options?: Dictionary<any>) {
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

		const filePath = new FilePath({
			name: inputs!.name,
			config: config,
			relativeToFilePath: inputs!.filePath,
			pathTypes: { '{componentPath}': inputs!.filePath },
			sourcePath: getSourcePath(),
			nameTypes: inputs!.nameTypes,
			postfixTypes: { ...(inputs!.postfixTypes || {}), '{type}': 'style' },
			postfix: [config.modules && stylingType !== 'js' ? 'module' : ''],
			fileExtension: fileExtension,
		});

		const StyleTypeTemplate =
			stylingType === 'js' ? JSStyleTypeTemplate : CSSStyleTypeTemplate;

		const template = new StyleTemplate(
			inputs!.name,
			config,
			// @ts-ignore
			StyleTypeTemplate
		);

		await handlePathCheck(filePath.dir);

		if (inputs?.template) {
			template.include(inputs.template, filePath.fullRelative!);
		}

		fs.writeFileSync(filePath.full, template.build().toString(), {
			encoding: 'utf-8',
		});
	}
}

export default CreateStyleAction;
