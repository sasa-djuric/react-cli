import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { toImportPath } from '../../utils/path';
import BaseTemplate from '../base.template';

class IndexTemplate extends BaseTemplate {
	constructor(private importPath: string) {
		super();
	}

	build(): TemplateBuilder {
		const template = new JSTemplateBuilder();
		const { importPath } = this;

		template.insertExportStatement({
			defaultExport: false,
			exportName: '{ default }',
			exportFrom: toImportPath(importPath),
		});

		return template;
	}
}

export default IndexTemplate;
