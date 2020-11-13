"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Libs
const case_1 = __importDefault(require("case"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Utils
const utils_1 = require("../utils");
// Buidlers
const js_template_builder_1 = __importDefault(require("../builders/js-template-builder"));
function _includeRedux(template, isClass = false) {
    if (!isClass) {
        template.generateFunction({
            name: 'mapStateToProps',
            args: ['state'],
            arrow: true,
            immidiateReturn: true,
            content: '{\n\n};',
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
            content: '{\n\n};',
            insertOptions: {
                newLine: { beforeCount: 1 },
                insertBefore: 'export',
            },
        });
    }
    template.insertImportStatement('{ connect }', 'react-redux');
    template.wrapExport(`connect(mapStateToProps, mapDispatchToProps)`);
}
function _includeStyle(template, name, config) {
    if (config.type !== 'styled-components') {
        const importName = utils_1.conditionalString(config.modules, 'styles');
        const importPath = `./${name}${utils_1.conditionalString(config.modules, '.module')}.${config.type}`;
        template.insertImportStatement(importName, importPath);
        if (config.modules) {
            const classStr = '<div className=';
            const classIndex = template.toString().indexOf(classStr) + classStr.length + 1;
            const classEndIndex = classIndex +
                template
                    .toString()
                    .substr(classIndex + 2)
                    .indexOf('"') +
                2;
            const className = template.toString().substr(classIndex, classEndIndex - classIndex);
            template.override(template.toString().substr(0, classIndex - 1) +
                `{styles.${className}}` +
                template.toString().substr(classEndIndex + 1));
        }
    }
    else {
        template.insertImportStatement('styled', 'styled-components');
    }
}
function _includeProptypes(template, name) {
    const draft = `${case_1.default.pascal(name)}.propTypes = {\n    \n};\n`;
    template.insertImportStatement('PropTypes', 'prop-types');
    template.insert(draft, { newLine: { beforeCount: 1 }, insertBefore: 'export' });
}
function _generateTemplate(name, options, constraints, config) {
    const feature = utils_1.featureToggle('component', config, options, constraints);
    const template = new js_template_builder_1.default({ indent: { count: 1, method: 'tab' } });
    const div = new js_template_builder_1.default({ indent: { count: 1, method: 'tab' } });
    template.insertImportStatement('React', 'react');
    div.generateDOMElement({ tag: 'div', props: { className: case_1.default.kebab(name) } });
    if (!options.class) {
        let implementsInterface = null;
        feature('typescript', () => {
            const interfaceName = `${case_1.default.pascal(name)}Props`;
            implementsInterface =
                config.project.typescript || options.typescript ? `React.SFC<${interfaceName}>` : null;
            template.generateInterface(interfaceName, '', '', { newLine: { beforeCount: 1, afterCount: 1 } });
        });
        template.generateFunction({
            name: case_1.default.pascal(name),
            arrow: true,
            immidiateReturn: true,
            interfaceName: implementsInterface,
            content: div.toString(),
            insertOptions: { newLine: { beforeCount: 1 } },
        });
    }
    else {
        template.generateClass({
            name: case_1.default.pascal(name),
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
        template.insert(`import React from 'react';\n\nconst ${case_1.default.pascal(name)} = styled.div${'`\n\n`'};`);
    }
    template.exportStatement(case_1.default.pascal(name), true, '', { newLine: { beforeCount: 1 } });
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
function create(name, componentPath, options, constraints, config) {
    const template = _generateTemplate(name, options, constraints, config);
    const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
    const filePath = path_1.default.resolve(componentPath, name + fileExtension);
    fs_1.default.writeFileSync(filePath, template, { encoding: 'utf-8' });
}
exports.default = { create };
