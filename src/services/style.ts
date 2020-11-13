// Libs
import casing from 'case';
import fs from 'fs';
import path from 'path';

// Builders
import CSSTemplateBuilder from '../builders/css-template-builder';
import JSTemplateBuilder from '../builders/js-template-builder';

// Constants
import { cssStyleTypes } from '../constants';

// Types
import { cssStyleType, jsStyleType, StyleConfig, styleType } from '../types/config';

function getStylingType(type: styleType) {
	if (cssStyleTypes.some(value => type === value)) {
		return 'css';
	}

	return 'js';
}

function _generateCSSTemplate(name: string, type: cssStyleType) {
	const template = new CSSTemplateBuilder(type);

	template.insertClass(casing.kebab(name));

	return template.toString();
}

function _generateJSTemplate(name: string, type: jsStyleType) {
	const template = new JSTemplateBuilder();

	template
		.insertImportStatement('{ styled }', 'styled-components', false, { newLine: { afterCount: 2 } })
		.insertExportStatement(`const ${casing.pascal(name)}Element = styled.div\`\n\n\``, false);

	return template.toString();
}

function _generateTemplate(name: string, type: styleType) {
	if (getStylingType(type) === 'css') {
		// @ts-ignore
		return _generateCSSTemplate(name, type);
	}

	// @ts-ignore
	return _generateJSTemplate(name, type);
}

function _getFileName(name: string, config: StyleConfig) {
	const stylingType = getStylingType(config.type);
	const filenamePostfix = config.modules ? '.module' : '';
	const extension = stylingType === 'js' ? 'js' : config.type;

	if (config.naming !== 'componentName') {
		return `${config.naming}${filenamePostfix}.${extension}`;
	}

	return `${name}${filenamePostfix}.${extension}`;
}

function create(name: string, config: StyleConfig, filePath: string) {
	fs.writeFileSync(
		path.resolve(filePath, _getFileName(name, config)),
		_generateTemplate(name, config.type),
		{
			encoding: 'utf-8',
		}
	);
}

export default { create, getStylingType };
