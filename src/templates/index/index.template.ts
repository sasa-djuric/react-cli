import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import BaseTemplate from '../base.template';

class IndexTemplate extends BaseTemplate {
	constructor(private importName: string, private importPath: string) {
		super();
	}

	build(): TemplateBuilder {
		const template = new JSTemplateBuilder();
		const { importName, importPath } = this;

		template
			.insertImportStatement({
				importName: importName,
				filePath: importPath,
			})
			.insertNewLine()
			.insertExportStatement({ defaultExport: true, exportName: importName });

		return template;
	}
}

export default IndexTemplate;
