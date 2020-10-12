// Types
import { Config, StyleConfig } from '../types/config';
import { Constraints, Options } from '../types/index';

// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Utils
import { exportStatement, importStatement, insertBeforeSpace, wrapExport } from '../utils/template';
import { conditionalString, featureToggle } from '../utils';

function includeRedux(template: string, isClass = false) {
	let draft = '';
	const templates = {
		map: `const mapStateToProps = state => {\n    return {\n    \n    };\n};\n\nconst mapDispatchToProps = dispatch => {\n    return {\n    \n    };\n};\n\n`,
		wrap: `connect(mapStateToProps, mapDispatchToProps)`,
	};

	if (!isClass) {
		draft = insertBeforeSpace(draft, templates.map, false);
	}

	draft = importStatement(template, '{ connect }', 'react-redux');
	draft = wrapExport(draft, templates.wrap);

	return draft;
}

function includeStyle(template: string, name: string, config: StyleConfig) {
	let draft = template;

	if (config.type !== 'styled-components') {
		draft = importStatement(
			draft,
			conditionalString(config.modules, 'styles'),
			`./${name}${conditionalString(config.modules, '.module')}.${config.type}`
		);
	} else {
		draft = importStatement(draft, 'styled', 'styled-components');
	}

	if (config.modules && config.type !== 'styled-components') {
		const classStr = '<div className=';
		const classIndex = draft.indexOf(classStr) + classStr.length + 1;
		const classEndIndex = classIndex + draft.substr(classIndex + 2).indexOf('"') + 2;
		const className = draft.substr(classIndex, classEndIndex - classIndex);

		draft = draft.substr(0, classIndex - 1) + `{styles.${className}}` + draft.substr(classEndIndex + 1);
	}

	return draft;
}

function includeProptypes(template: string, name: string) {
	let draft = template;

	draft = importStatement(draft, 'PropTypes', 'prop-types');
	draft = insertBeforeSpace(draft, `${casing.pascal(name)}.propTypes = {\n    \n};\n\n`, false);

	return draft;
}

function generateTemplate(name: string, options: Options, constraints: Constraints, config: Config) {
	let template = importStatement('', 'React', 'react');
	const feature = featureToggle('component', config, options, constraints);

	if (!options.class) {
		template =
			template +
			`\nconst ${casing.pascal(name)}${conditionalString(
				config.project.typescript,
				`: React.SFC<Props>`
			)} = () => {\n	return <div className="${casing.kebab(name)}"></div>;\n};`;

		if (config.project.typescript) {
			template = insertBeforeSpace(template, `\ninterface Props {\n    \n};\n`);
		}
	} else {
		template =
			template +
			`\nclass ${casing.pascal(
				name
			)} extends React.Component {\n     render() {\n        <div className="${casing.kebab(
				name
			)}"></div>;\n    }\n}`;
	}

	if (config.style.type === 'styled-components') {
		template = `import React from 'react';\n\nconst ${casing.pascal(name)} = styled.div${'`\n\n`'};`;
	}

	template = exportStatement(template, casing.pascal(name), true);

	feature('style', () => {
		template = includeStyle(template, name, config.style);
	});
	feature('proptypes', () => {
		template = includeProptypes(template, name);
	});
	feature('redux', () => {
		template = includeRedux(template, options.class);
	});

	return template;
}

function create(
	name: string,
	componentPath: string,
	options: Options,
	constraints: Constraints,
	config: Config
) {
	const template = generateTemplate(name, options, constraints, config);
	const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
	const filePath = path.resolve(componentPath, name + fileExtension);

	fs.writeFileSync(filePath, template, { encoding: 'utf-8' });
}

export default { create };
