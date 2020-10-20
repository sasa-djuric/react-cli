import fs from 'fs';
import path from 'path';
import casing from 'case';
import JSTemplateBuilder from '../builders/js-template-builder';

function create(name: string, config: { typescript: boolean }, componentPath: string) {
	const template = new JSTemplateBuilder({ indent: 4 });
	const extension = config.typescript ? '.ts' : '.js';
	const fileName = name + '.story' + extension;
	const componentName = casing.pascal(name);
	const templateComponent = new JSTemplateBuilder({ indent: 4 });

	templateComponent.generateDOMElement({ tag: componentName, spreadProps: true, selfClosing: true });

	template.insertImportStatement('React', 'react');
	template.insertImportStatement(componentName, `./${name}${extension}`);
	template.exportStatement(
		`{\n    title: 'Components/${componentName}',\n    component: ${componentName}\n}`,
		true,
		undefined,
		{ newLine: { beforeCount: 1 } }
	);
	template.generateFunction({
		name: 'Template',
		args: ['args'],
		arrow: true,
		content: templateComponent.toString(),
		body: false,
		insertOptions: {
			newLine: {
				beforeCount: 2,
			},
		},
	});

	template.exportStatement(`const Primary = Template.bind({})`, false, undefined, {
		newLine: { beforeCount: 1 },
	});
	template.insert(`Primary.args = {\n{{{indent}}}\n};`, { newLine: { beforeCount: 2 } });

	fs.writeFileSync(path.resolve(componentPath, fileName), template.toString(), { encoding: 'utf-8' });
}

export default { create };
