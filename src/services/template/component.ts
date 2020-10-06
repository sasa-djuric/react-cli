import casing from 'case';
import { config } from '../../constants';
import { insertBeforeSpace, wrapExport } from '../../utils/template';

function includeRedux(template: string) {
	let draft: string;
	const templates = {
		import: `import { connect } from 'react-redux';\n`,
		map: `const mapStateToProps = state => {\n    return {\n    \n    };\n};\n\nconst mapDispatchToProps = dispatch => {\n    return {\n    \n    };\n};\n\n`,
		wrap: 'connect(mapStateToProps, mapDispatchToProps)',
	};

	draft = insertBeforeSpace(template, templates.import);
	draft = insertBeforeSpace(draft, templates.map, false);
	draft = wrapExport(draft, templates.wrap);

	return draft;
}

function includeStory(template: string) {
	//
}

function includeStyle(template: string, name: string) {
	let draft = template;
	const styleConfig = config.style;
	const templates = {
		import: {
			standard:
				styleConfig.type !== 'styled-components' ? `import './${name}.${styleConfig.type}';\n` : '',
			modules:
				styleConfig.type !== 'styled-components'
					? `import styles from './${name}.module.${styleConfig.type}';\n`
					: '',
		},
	};

	if (styleConfig.type !== 'styled-components') {
		draft = insertBeforeSpace(draft, templates.import[styleConfig.modules ? 'modules' : 'standard']);
	} else {
		draft = insertBeforeSpace(draft, `import styled from 'styled-components';\n`);
	}

	if (styleConfig.modules && styleConfig.type !== 'styled-components') {
		const classIndex = draft.indexOf('<div className=') + 16;
		const classEndIndex = classIndex + draft.substr(classIndex + 2).indexOf('"') + 2;
		const className = draft.substr(classIndex, classEndIndex - classIndex);

		draft = draft.substr(0, classIndex - 1) + `{styles.${className}}` + draft.substr(classEndIndex + 1);
	}

	return draft;
}

function includeTest(template: string) {
	//
}

function includeProptypes(template: string) {
	//
}

function create(name: string, options: { [key: string]: boolean }) {
	let template;

	template = `import React from 'react';\n\nconst ${casing.pascal(
		name
	)} = () => {\n	return <div className="${casing.kebab(name)}"></div>;\n};\n\nexport default ${casing.pascal(
		name
	)};`;

	if (config.style.type === 'styled-components') {
		template = `import React from 'react';\n\nconst ${casing.pascal(
			name
		)} = styled.div${'`\n\n`'};\n\nexport default ${casing.pascal(name)};`;
	}

	if (options.redux) {
		template = includeRedux(template);
	}

	if (options.style || config.component.withStyle) {
		template = includeStyle(template, name);
	}

	return template;
}

export default { create };
