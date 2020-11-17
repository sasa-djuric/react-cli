import fs from 'fs';
import path from 'path';
import casing from 'case';
import JSTemplateBuilder from '../builders/js-template-builder';

function create(name: string, config: { typescript: boolean }, componentPath: string) {
	const template = new JSTemplateBuilder();
	const extension = config.typescript ? '.ts' : '.js';
	const fileName = name + '.story' + extension;
	const componentName = casing.pascal(name);
	const templateComponent = new JSTemplateBuilder();

	templateComponent.insertElement({ tag: componentName, spreadProps: true, selfClosing: true });

	template
		.insertImportStatement('React', 'react')
		.insertImportStatement(componentName, `./${name}${extension}`)
		.insertExportStatement(
			`{\n    title: 'Components/${componentName}',\n    component: ${componentName}\n}`,
			true,
			undefined,
			{ newLine: { beforeCount: 1 } }
		)
		.insertFunction({
			name: 'Template',
			args: ['args'],
			arrow: true,
			content: templateComponent,
			body: false,
			insertOptions: {
				newLine: {
					beforeCount: 2,
				},
			},
		})
		.insertExportStatement(`const Primary = Template.bind({})`, false, undefined, {
			newLine: { beforeCount: 1 },
		})
		.insert(`Primary.args = {\n\n};`, { newLine: { beforeCount: 2 } });

	fs.writeFileSync(path.resolve(componentPath, fileName), template.toString(), {
		encoding: 'utf-8',
	});
}

export default { create };
