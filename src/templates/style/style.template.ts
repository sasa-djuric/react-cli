import BaseTemplate from '../base.template';
import { StyleConfig } from '../../configuration';
import { BaseStyleTypeTemplateI } from './base.style.type.template';
import { toImportPath } from '../../utils/path';

class StyleTemplate extends BaseTemplate {
	constructor(
		private name: string,
		private config: StyleConfig,
		private StyleTypeTemplate: BaseStyleTypeTemplateI
	) {
		super();
	}

	build() {
		const { name, config, StyleTypeTemplate } = this;

		return new StyleTypeTemplate(name, config).build();
	}

	include(template: string, filePath: string): string {
		return new this.StyleTypeTemplate(this.name, this.config).include(
			template,
			this.name,
			toImportPath(filePath)
		);
	}
}

export default StyleTemplate;
