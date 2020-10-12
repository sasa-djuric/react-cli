"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const case_1 = __importDefault(require("case"));
const template_1 = require("../utils/template");
function create(name, config, componentPath) {
    let template = '';
    const extension = config.typescript ? '.ts' : 'js';
    const fileName = name + '.story' + extension;
    const componentName = case_1.default.pascal(name);
    template = template_1.importStatement(template, 'React', 'react');
    template = template_1.importStatement(template, componentName, `./${name}${extension}`);
    template = template_1.exportStatement(template, `{\n    title: 'Components/${componentName}',\n    component: ${componentName}\n}`, true, undefined, false);
    template = template + `\n\nconst Template = (args) => <${componentName} {...props} />;`;
    template = template_1.exportStatement(template, `const Primary = Template.bind({})`, false);
    template = template + `\n\nPrimary.args = {\n    \n};`;
    fs_1.default.writeFileSync(path_1.default.resolve(componentPath, fileName), template, { encoding: 'utf-8' });
}
exports.default = { create };
