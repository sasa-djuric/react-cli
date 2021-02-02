import BaseStyleTypeTemplate from './base.style.type.template';
import CSSTemplateBuilder from '../../builders/css-template.builder';
import { cssStyleType } from '../../configuration';
import casing from 'case';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { toImportPath } from '../../utils/path';

class CSSStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const template = new CSSTemplateBuilder(this.config.type as cssStyleType);

		template.insertClass(casing.kebab(this.name));

		return template;
	}

	include(
		template: JSTemplateBuilder,
		name: string,
		importPath: string,
		elementAction: any
	) {
		const importName = this.config.modules ? 'styles' : '';

		template.insertImportStatement({
			importName,
			filePath: toImportPath(importPath),
		});

		if (elementAction) {
			elementAction.tag = 'div';
			elementAction.props = {
				...elementAction.props,
				className: this.config.modules ? `{styles.${name}}` : name,
			};
		}
	}
}

export default CSSStyleTypeTemplate;
