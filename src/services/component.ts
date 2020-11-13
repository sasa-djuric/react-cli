// Types
import { Config, StyleConfig } from '../types/config';
import { Constraints, Options } from '../types/index';

// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Utils
import { conditionalString, featureToggle } from '../utils';
import dependency from '../utils/dependency';

// Buidlers
import JSTemplateBuilder from '../builders/js-template-builder';

// Services
import styleService from './style';

function _includeRedux(template: JSTemplateBuilder) {
	template
		.insertFunction({
			name: 'mapStateToProps',
			args: ['state'],
			arrow: true,
			immidiateReturn: true,
			content: '{\n\n};',
			insertOptions: {
				newLine: { beforeCount: 1 },
				insertBefore: 'export',
			},
		})
		.insertFunction({
			name: 'mapDispatchToProps',
			args: ['dispatch'],
			arrow: true,
			immidiateReturn: true,
			content: '{\n\n};',
			insertOptions: {
				newLine: { beforeCount: 1 },
				insertBefore: 'export',
			},
		})
		.insertImportStatement('{ connect }', 'react-redux')
		.wrapExport(`connect(mapStateToProps, mapDispatchToProps)`);
}

function _includeStyle(template: JSTemplateBuilder, name: string, config: StyleConfig) {
	const fileNamePostfix = config.modules ? '.module' : '';
	const fileName = (config.naming === 'componentName' ? name : config.naming) + fileNamePostfix;
	const importPath = `./${fileName}.${styleService.getStylingType(config.type)}`;

	if (config.type !== 'styled-components') {
		const importName = conditionalString(config.modules, 'styles');

		template.insertImportStatement(importName, importPath);

		if (config.modules) {
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
	} else {
		const templateString = template.toString();
		const elementName = `${casing.pascal(name)}Element`;

		template
			.override(
				templateString.substr(0, templateString.indexOf('<div')) +
					templateString.substr(templateString.lastIndexOf('>') + 1)
			)
			.insertElement({
				tag: elementName,
				insertOptions: { insertAtIndex: templateString.indexOf('<div') },
			})
			.insertImportStatement(`{ ${elementName} }`, importPath);
	}
}

function _includeProptypes(template: JSTemplateBuilder, name: string) {
	const draft = `${casing.pascal(name)}.propTypes = {\n\n};\n`;

	template
		.insertImportStatement('PropTypes', 'prop-types')
		.insert(draft, { newLine: { beforeCount: 1 }, insertBefore: 'export' });
}

function _generateTemplate(name: string, options: Options, constraints: Constraints, config: Config) {
	const feature = featureToggle('component', config, options, constraints);
	const template = new JSTemplateBuilder();
	const element = new JSTemplateBuilder();
	const reactVersion = +dependency.getVersion('react')?.replace(/\^|\./g, '') ?? 0;

	if (!reactVersion || reactVersion < 701) {
		template.insertImportStatement('React', 'react');
	}

	element.insertElement({ tag: 'div', props: { className: casing.kebab(name) } });

	if (!options.class) {
		let implementsInterface = null;

		feature('typescript', () => {
			const interfaceName = `${casing.pascal(name)}Props`;

			implementsInterface =
				config.project.typescript || options.typescript ? `React.SFC<${interfaceName}>` : null;

			template.insertInterface(interfaceName, '', '', { newLine: { afterCount: 1 } });
		});

		template.insertFunction({
			name: casing.pascal(name),
			arrow: true,
			immidiateReturn: true,
			interfaceName: implementsInterface,
			content: element.toString(),
			insertOptions: { newLine: { beforeCount: 1 } },
		});
	} else {
		let withTypescript = false;

		feature('typescript', () => {
			withTypescript = true;

			template.insertInterface('Props', '', '', { newLine: { afterCount: 1 } });
			template.insertInterface('State', '', '', { newLine: { beforeCount: 1, afterCount: 1 } });
		});

		template.insertClass({
			name: casing.pascal(name),
			extendsName: 'React.Component',
			methods: [
				{
					name: 'render',
					content: element.toString(),
				},
			],
			extendsTypeArguments: withTypescript ? ['Props', 'State'] : undefined,
			insertOptions: { newLine: { beforeCount: 1, afterCount: 1 } },
		});
	}

	template.insertExportStatement(casing.pascal(name), true, '', { newLine: { beforeCount: 1 } });

	feature('style', () => {
		_includeStyle(template, name, config.style);
	});

	feature('proptypes', () => {
		_includeProptypes(template, name);
	});

	feature('redux', () => {
		_includeRedux(template);
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
	const fileExtension = config.project.typescript ? 'tsx' : 'jsx';
	const filePath = path.resolve(
		componentPath,
		`${name}${config.component.fileNamePostfix || ''}.${fileExtension}`
	);

	fs.writeFileSync(filePath, template, { encoding: 'utf-8' });
}

export default { create };
