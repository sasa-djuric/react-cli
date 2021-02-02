// Libs
import casing from 'case';

// Builders
import JSTemplateBuilder from '../../builders/js-template.builder';

// Base
import BaseTemplate from '../base.template';

class HookTemplate extends BaseTemplate {
	constructor(private name: string, private typescript: boolean) {
		super();
	}

	build() {
		const name = casing.camel(this.name);
		const template = new JSTemplateBuilder()
			.insertFunction({ name: name, arrow: true, body: true })
			.insertNewLine()
			.insertExportStatement({
				exportName: name,
				defaultExport: true,
			});

		return template;
	}
}

export default HookTemplate;
