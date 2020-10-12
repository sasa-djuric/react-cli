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
const template_1 = require("../utils/template");
const utils_1 = require("../utils");
function includeRedux(template, isClass = false) {
    let draft = '';
    const templates = {
        map: `const mapStateToProps = state => {\n    return {\n    \n    };\n};\n\nconst mapDispatchToProps = dispatch => {\n    return {\n    \n    };\n};\n\n`,
        wrap: `connect(mapStateToProps, mapDispatchToProps)`,
    };
    if (!isClass) {
        draft = template_1.insertBeforeSpace(draft, templates.map, false);
    }
    draft = template_1.importStatement(template, '{ connect }', 'react-redux');
    draft = template_1.wrapExport(draft, templates.wrap);
    return draft;
}
function includeStyle(template, name, config) {
    let draft = template;
    if (config.type !== 'styled-components') {
        draft = template_1.importStatement(draft, utils_1.conditionalString(config.modules, 'styles'), `./${name}${utils_1.conditionalString(config.modules, '.module')}.${config.type}`);
    }
    else {
        draft = template_1.importStatement(draft, 'styled', 'styled-components');
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
function includeProptypes(template, name) {
    let draft = template;
    draft = template_1.importStatement(draft, 'PropTypes', 'prop-types');
    draft = template_1.insertBeforeSpace(draft, `${case_1.default.pascal(name)}.propTypes = {\n    \n};\n\n`, false);
    return draft;
}
function generateTemplate(name, options, constraints, config) {
    let template = template_1.importStatement('', 'React', 'react');
    const feature = utils_1.featureToggle('component', config, options, constraints);
    if (!options.class) {
        template =
            template +
                `\nconst ${case_1.default.pascal(name)}${utils_1.conditionalString(config.project.typescript, `: React.SFC<Props>`)} = () => {\n	return <div className="${case_1.default.kebab(name)}"></div>;\n};`;
        if (config.project.typescript) {
            template = template_1.insertBeforeSpace(template, `\ninterface Props {\n    \n};\n`);
        }
    }
    else {
        template =
            template +
                `\nclass ${case_1.default.pascal(name)} extends React.Component {\n     render() {\n        <div className="${case_1.default.kebab(name)}"></div>;\n    }\n}`;
    }
    if (config.style.type === 'styled-components') {
        template = `import React from 'react';\n\nconst ${case_1.default.pascal(name)} = styled.div${'`\n\n`'};`;
    }
    template = template_1.exportStatement(template, case_1.default.pascal(name), true);
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
function create(name, componentPath, options, constraints, config) {
    const template = generateTemplate(name, options, constraints, config);
    const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
    const filePath = path_1.default.resolve(componentPath, name + fileExtension);
    fs_1.default.writeFileSync(filePath, template, { encoding: 'utf-8' });
}
exports.default = { create };
