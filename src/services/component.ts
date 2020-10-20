// Types
import { Config, StyleConfig } from '../types/config';
import { Constraints, Options } from '../types/index';

// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Utils
import { conditionalString, featureToggle } from '../utils';
import JSTemplateBuilder from '../builders/js-template-builder';

function _includeRedux(template: JSTemplateBuilder, isClass = false) {
	if (!isClass) {
		template.generateFunction({
			name: 'mapStateToProps',
			args: ['state'],
			arrow: true,
			immidiateReturn: true,
			content: '{\n{{{indent}}}{{{indent}}}\n{{{indent}}}};',
			insertOptions: {
				newLine: { beforeCount: 1 },
				insertBefore: 'export',
			},
		});

		template.generateFunction({
			name: 'mapDispatchToProps',
			args: ['dispatch'],
			arrow: true,
			immidiateReturn: true,
			content: '{\n{{{indent}}}{{{indent}}}\n{{{indent}}}};',
			insertOptions: {
				newLine: { beforeCount: 1 },
				insertBefore: 'export',
			},
		});
	}

	template.insertImportStatement('{ connect }', 'react-redux');
	template.wrapExport(`connect(mapStateToProps, mapDispatchToProps)`);
}

function _includeStyle(template: JSTemplateBuilder, name: string, config: StyleConfig) {
	if (config.type !== 'styled-components') {
		const importName = conditionalString(config.modules, 'styles');
		const importPath = `./${name}${conditionalString(config.modules, '.module')}.${config.type}`;

		template.insertImportStatement(importName, importPath);
	} else {
		template.insertImportStatement('styled', 'styled-components');
	}

	if (config.modules && config.type !== 'styled-components') {
		const classStr = '<div className=';
		const classIndex = template.toString().indexOf(classStr) + classStr.length + 1;
		const classEndIndex =
			classIndex +
			template
				.toString()
				.substr(classIndex + 2)
				.indexOf('"') +
			2;
		const className = template.toString().substr(classIndex, classEndIndex - classIndex);

		template.override(
			template.toString().substr(0, classIndex - 1) +
				`{styles.${className}}` +
				template.toString().substr(classEndIndex + 1)
		);
	}
}

function _includeProptypes(template: JSTemplateBuilder, name: string) {
	const draft = `${casing.pascal(name)}.propTypes = {\n    \n};\n`;

	template.insertImportStatement('PropTypes', 'prop-types');
	template.insert(draft, { newLine: { beforeCount: 1 }, insertBefore: 'export' });
}

function _generateTemplate(name: string, options: Options, constraints: Constraints, config: Config) {
	const feature = featureToggle('component', config, options, constraints);
	const template = new JSTemplateBuilder({ indent: 4 });
	const div = new JSTemplateBuilder({ indent: 4 });

	template.insertImportStatement('React', 'react');
	div.generateDOMElement({ tag: 'div', props: { className: casing.kebab(name) } });

	if (!options.class) {
		let implementsInterface = null;

		feature('typescript', () => {
			const interfaceName = `${casing.pascal(name)}Props`;

			implementsInterface =
				config.project.typescript || options.typescript ? `React.SFC<${interfaceName}>` : null;

			template.generateInterface(interfaceName, '', '', { newLine: { beforeCount: 1, afterCount: 1 } });
		});

		template.generateFunction({
			name: casing.pascal(name),
			arrow: true,
			immidiateReturn: true,
			interfaceName: implementsInterface,
			content: div.toString(),
			insertOptions: { newLine: { beforeCount: 1 } },
		});
	} else {
		template.generateClass({
			name: casing.pascal(name),
			extendsName: 'React.Component',
			methods: [
				{
					name: 'render',
					content: div.toString(),
				},
			],
		});
	}

	if (config.style.type === 'styled-components') {
		template.insert(
			`import React from 'react';\n\nconst ${casing.pascal(name)} = styled.div${'`\n\n`'};`
		);
	}

	template.exportStatement(casing.pascal(name), true, '', { newLine: { beforeCount: 1 } });

	feature('style', () => {
		_includeStyle(template, name, config.style);
	});

	feature('proptypes', () => {
		_includeProptypes(template, name);
	});

	feature('redux', () => {
		_includeRedux(template, options.class);
	});

	return template.toString();
}

function create(
	name: string,
	componentPath: string,
	options: Options,
	constraints: Constraints,
	config: Config
) {
	const template = _generateTemplate(name, options, constraints, config);
	const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
	const filePath = path.resolve(componentPath, name + fileExtension);

	fs.writeFileSync(filePath, template, { encoding: 'utf-8' });
}

export default { create };
