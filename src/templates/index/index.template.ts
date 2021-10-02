import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { toImportPath } from '../../utils/path';
import BaseTemplate from '../base.template';

class IndexTemplate extends BaseTemplate {
	constructor(
		private importPath: string,
		private exportProp: 'default' | 'all' | string
	) {
		super();
	}

	build(): TemplateBuilder {
		const template = new JSTemplateBuilder();
		const { importPath } = this;
		const exportName =
			this.exportProp === 'default'
				? '{ default }'
				: this.exportProp === 'all'
				? '*'
				: this.exportProp;

		template.insertExportStatement({
			defaultExport: false,
			exportName: exportName,
			exportFrom: toImportPath(importPath),
		});

		return template;
	}
}

export default IndexTemplate;
