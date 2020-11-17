// Types
import { Config, StyleConfig } from '../types/config';
import { Constraints, Options } from '../types/index';

// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Utils
import dependency from '../utils/dependency';
import featureToggling from '../utils/feature-toggling';

// Buidlers
import JSTemplateBuilder, { ActionType } from '../builders/js-template-builder';

// Services
import styleService from './style';

export enum Feature {
	InFolder = 'inFolder',
	Style = 'style',
	PropTypes = 'proptypes',
	Redux = 'redux',
	TypeScript = 'typescript',
	Index = 'index',
	Test = 'test',
	Story = 'story',
	Open = 'open',
}

function _includeRedux(template: JSTemplateBuilder) {
	const body = new JSTemplateBuilder().insertEmptyBody();

	template
		.insertFunction({
			name: 'mapStateToProps',
			args: ['state'],
			arrow: true,
			immidiateReturn: true,
			content: body,
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
			content: body,
			insertOptions: {
				newLine: { beforeCount: 1 },
				insertBefore: 'export',
			},
		})
		.insertImportStatement('{ connect }', 'react-redux')
		.wrapExport(`connect(mapStateToProps, mapDispatchToProps)`);
}

function _includeStyle(
	template: JSTemplateBuilder,
	element: JSTemplateBuilder,
	name: string,
	config: StyleConfig
) {
	const fileNamePostfix = config.modules ? '.module' : '';
	const fileName = (config.naming === 'componentName' ? name : config.naming) + fileNamePostfix;
	const fileExtension = styleService.getStylingType(config.type);
	const importPath = `./${fileName}.${fileExtension}`;
	const insertElementAction = element.getActionsByType(ActionType.Element)?.[0];

	if (styleService.getStylingType(config.type) === 'css') {
		const importName = config.modules ? 'styles' : '';

		template.insertImportStatement(importName, importPath);

		if (config.modules) {
			if (insertElementAction) {
				insertElementAction.args[0] = {
					...insertElementAction.args[0],
					tag: 'div',
					props: {
						...insertElementAction.args[0].props,
						className: `{styles.${insertElementAction.args[0].props.className}}`,
					},
				};
			}
		}
	} else {
		const elementName = `${casing.pascal(name)}Element`;

		if (insertElementAction) {
			insertElementAction.args[0] = {
				...insertElementAction.args[0],
				tag: elementName,
				props: {},
			};
		}

		template.insertImportStatement(`{ ${elementName} }`, importPath);
	}
}

function _includeProptypes(template: JSTemplateBuilder, name: string) {
	const draft = `${casing.pascal(name)}.propTypes = {\n\n};\n`;

	template
		.insertImportStatement('PropTypes', 'prop-types')
		.insert(draft, { newLine: { beforeCount: 1 }, insertBefore: 'export' });
}

function _generateTemplate(
	name: string,
	options: Options,
	constraints: Constraints,
	config: Config
) {
	const feature = featureToggling.toggle('component', config, options, constraints);
	const template = new JSTemplateBuilder();
	const element = new JSTemplateBuilder();
	const reactVersion = parseInt(dependency.getVersion('react')?.replace(/\^|\./g, ''));

	if (!reactVersion || reactVersion < 701) {
		template.insertImportStatement('React', 'react');
	}

	element.insertElement({
		tag: 'div',
		props: { className: casing.kebab(name) },
	});

	if (!options.class) {
		let implementsInterface = null;

		feature(Feature.TypeScript, () => {
			const interfaceName = casing.pascal(name) + 'Props';

			implementsInterface = `React.SFC<${interfaceName}>`;

			template.insertInterface({
				name: interfaceName,
				insertOptions: {
					newLine: { beforeCount: 1, afterCount: 1 },
				},
			});
		});

		template.insertFunction({
			name: casing.pascal(name),
			arrow: true,
			immidiateReturn: true,
			interfaceName: implementsInterface,
			content: element,
			insertOptions: { newLine: { beforeCount: 1 } },
		});
	} else {
		let withTypescript = false;

		feature(Feature.TypeScript, () => {
			withTypescript = true;

			template
				.insertInterface({
					name: 'Props',
					insertOptions: {
						newLine: { beforeCount: 1, afterCount: 1 },
					},
				})
				.insertInterface({
					name: 'State',
					insertOptions: {
						newLine: { beforeCount: 1, afterCount: 1 },
					},
				});
		});

		template.insertClass({
			name: casing.pascal(name),
			extendsName: 'React.Component',
			methods: [
				{
					name: 'render',
					content: element,
				},
			],
			extendsTypeArguments: withTypescript ? ['Props', 'State'] : undefined,
			insertOptions: { newLine: { beforeCount: 1, afterCount: 1 } },
		});
	}

	template.insertExportStatement(casing.pascal(name), true, '', {
		newLine: { beforeCount: 1 },
	});

	feature(Feature.Style, () => {
		_includeStyle(template, element, name, config.style);
	});

	feature(Feature.PropTypes, () => {
		_includeProptypes(template, name);
	});

	feature(Feature.Redux, () => {
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
