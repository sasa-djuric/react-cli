import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { StorybookConfig } from '../../configuration';
import BaseTemplate from '../base.template';
import casing from 'case';
import { toImportPath } from '../../utils/path';

class StoryBookTemplate extends BaseTemplate {
	constructor(
		private componentName: string,
		private importPath: string,
		private config: StorybookConfig
	) {
		super();
	}

	build(): TemplateBuilder {
		const template = new JSTemplateBuilder();
		const templateComponent = new JSTemplateBuilder();
		const pascalComponentName = casing.pascal(this.componentName);

		templateComponent.insertElement({
			tag: pascalComponentName,
			spreadProps: true,
			selfClosing: true,
		});

		template
			.insertImportStatement({ importName: 'React', filePath: 'react' })
			.insertImportStatement({
				importName: pascalComponentName,
				filePath: toImportPath(this.importPath),
			})
			.insertNewLine()
			.insertExportStatement({
				exportName: `{\n    title: 'Components/${pascalComponentName}',\n    component: ${pascalComponentName}\n}`,
				defaultExport: true,
			})
			.insertNewLine(2)
			.insertFunction({
				name: 'Template',
				args: ['props'],
				arrow: true,
				content: templateComponent,
				body: false,
			})
			.insertNewLine()
			.insertExportStatement({
				exportName: `const Primary = Template.bind({})`,
				defaultExport: false,
			})
			.insertNewLine(2)
			.insert(`Primary.args = {\n\n};`);

		return template;
	}
}

export default StoryBookTemplate;
