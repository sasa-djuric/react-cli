import BaseStyleTypeTemplate from './base.style.type.template';
import JSTemplateBuilder from '../../builders/js-template.builder';
import casing from 'case';
import { removeExtension } from '../../utils/path';

class JSStyleTypeTemplate extends BaseStyleTypeTemplate {
	build() {
		const { name, config } = this;
		const template = new JSTemplateBuilder();

		template
			.insertImportStatement({
				importName: 'styled',
				filePath: 'styled-components',
			})
			.insertNewLine()
			.insertExportStatement({
				exportName: `const ${casing.pascal(name)}Element = styled.div\`\n\n\``,
				defaultExport: false,
			});

		return template;
	}

	include(
		template: JSTemplateBuilder,
		name: string,
		importPath: string,
		elementAction: any
	) {
		const elementName = `${casing.pascal(name)}Element`;

		if (elementAction) {
			elementAction.tag = elementName;
			elementAction.props = {};
			elementAction.children = '\n\n';
		}

		template.insertImportStatement({
			importName: `{ ${elementName} }`,
			filePath: removeExtension(importPath),
		});
	}
}

export default JSStyleTypeTemplate;
