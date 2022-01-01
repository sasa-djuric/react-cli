import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import BaseTemplate from '../base.template';
import casing from 'case';

class PropTypesTemplate extends BaseTemplate {
	build(): string {
		throw new Error('Method not implemented.');
	}

	include(template: JSTemplateBuilder, componentName: string) {
		const draft = `${casing.pascal(componentName)}.propTypes = {\n\n};\n`;

		template
			.insertImportStatement({ importName: 'PropTypes', filePath: 'prop-types' })
			.insert(draft, { newLine: { beforeCount: 1 }, insertBefore: 'export' });
	}
}

export default PropTypesTemplate;
