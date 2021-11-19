import JSTemplateBuilder from '../../builders/js-template.builder';
import { TestConfig } from '../../configuration';
import BaseTemplate from '../base.template';
import casing from 'case';
import { toImportPath } from '../../utils/path';

class TestTemplate extends BaseTemplate {
	constructor(
		private componentName: string,
		private importPath: string,
		private config: TestConfig,
		private componentDefaultImport: boolean
	) {
		super();
	}

	build() {
		const template = new JSTemplateBuilder();
		const pascalComponentName = casing.pascal(this.componentName);

		template
			.insertImportStatement({
				importName: pascalComponentName,
				type: this.componentDefaultImport ? 'default' : 'destructure',
				filePath: toImportPath(this.importPath),
			})
			.insertNewLine(1)
			.insertFunctionCall({
				name: 'describe',
				args: [
					`"${pascalComponentName}"`,
					new JSTemplateBuilder().insertFunction({
						anonymous: true,
						arrow: true,
						body: true,
						content: new JSTemplateBuilder().insertFunctionCall({
							name: 'it',
							args: [
								`"Should "`,
								new JSTemplateBuilder().insertFunction({
									anonymous: true,
									arrow: true,
									body: true,
								}),
							],
						}),
					}),
				],
			});

		return template;
	}
}

export default TestTemplate;
