import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import { StorybookConfig } from '../../configuration';
import BaseTemplate from '../base.template';
import casing from 'case';
import { toImportPath } from '../../utils/path';
import { getDependencyVersion } from '../../utils/dependency';

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
		const reactVersion = getDependencyVersion('react');

		templateComponent.insertElement({
			tag: pascalComponentName,
			spreadProps: true,
			selfClosing: true,
		});

		if (!reactVersion || reactVersion < 17.01) {
			template.insertImportStatement({ importName: 'React', filePath: 'react' });
		}

		let storyDefinition = `{\n    title: 'Components/${pascalComponentName}',\n    component: ${pascalComponentName}\n}`;
		let templateInterface = ``;

		if (this.config.typescript) {
			storyDefinition = `${storyDefinition} as Meta`;
			templateInterface = `Story`;

			template.insertImportStatement({
				filePath: '@storybook/react',
				importName: `{ Meta, Story }`,
			});
		}

		template
			.insertImportStatement({
				importName: pascalComponentName,
				filePath: toImportPath(this.importPath),
			})
			.insertNewLine()
			.insertExportStatement({
				exportName: storyDefinition,
				defaultExport: true,
			})
			.insertNewLine(2)
			.insertFunction({
				name: 'Template',
				args: ['props'],
				arrow: true,
				content: templateComponent,
				body: false,
				interfaceName: templateInterface,
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
