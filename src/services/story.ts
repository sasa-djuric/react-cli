import fs from 'fs';
import path from 'path';
import casing from 'case';
import { exportStatement, importStatement } from '../utils/template';

function create(name: string, config: { typescript: boolean }, componentPath: string) {
	let template = '';
	const extension = config.typescript ? '.ts' : 'js';
	const fileName = name + '.story' + extension;
	const componentName = casing.pascal(name);

	template = importStatement(template, 'React', 'react');
	template = importStatement(template, componentName, `./${name}${extension}`);
	template = exportStatement(
		template,
		`{\n    title: 'Components/${componentName}',\n    component: ${componentName}\n}`,
		true,
		undefined,
		false
	);
	template = template + `\n\nconst Template = (args) => <${componentName} {...props} />;`;
	template = exportStatement(template, `const Primary = Template.bind({})`, false);
	template = template + `\n\nPrimary.args = {\n    \n};`;

	fs.writeFileSync(path.resolve(componentPath, fileName), template, { encoding: 'utf-8' });
}

export default { create };
