// Libs
import casing from 'case';

// Builders
import JSTemplateBuilder from '../../builders/js-template.builder';

// Utils
import { getDependencyVersion, doesDependencyExists } from '../../utils/dependency';

// Types
import { ComponentConfig } from '../../configuration';

// Base
import { BaseComponentTypeTemplateI } from './base.component.type.template';
import BaseTemplate from '../base.template';

class ComponentTemplate extends BaseTemplate {
	constructor(
		private readonly name: string,
		private readonly config: ComponentConfig,
		private readonly ComponentTypeTemplate: BaseComponentTypeTemplateI
	) {
		super();
	}

	build() {
		const { name, config, ComponentTypeTemplate } = this;
		const template = new JSTemplateBuilder();
		const element = new JSTemplateBuilder();
		const reactVersion = getDependencyVersion('react');
		const isReactNative = doesDependencyExists('react-native');

		if (config.class || !reactVersion || reactVersion < 17.01) {
			template.insertImportStatement({ importName: 'React', filePath: 'react' });
		}

		new ComponentTypeTemplate(
			template,
			element,
			name,
			config.typescript!,
			config.defaultExport
		).build();

		this.includeElement(template, element, isReactNative);

		if (config.defaultExport) {
			template.insertNewLine().insertExportStatement({
				exportName: casing.pascal(name),
				defaultExport: true,
			});
		}

		return template;
	}

	private includeElement(
		template: JSTemplateBuilder,
		element: JSTemplateBuilder,
		isReactNative: boolean
	) {
		if (isReactNative) {
			template.insertImportStatement({
				importName: '{ View }',
				filePath: 'react-native',
			});

			return element.insertElement({
				tag: 'View',
			});
		}

		return element.insertElement({
			tag: 'div',
			props: this.config.testId ? { 'data-testid': casing.pascal(this.name) } : {},
			children: '\n\n',
		});
	}
}

export default ComponentTemplate;
