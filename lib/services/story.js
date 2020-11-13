"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const case_1 = __importDefault(require("case"));
const js_template_builder_1 = __importDefault(require("../builders/js-template-builder"));
function create(name, config, componentPath) {
    const template = new js_template_builder_1.default({ indent: { count: 1, method: 'tab' } });
    const extension = config.typescript ? '.ts' : '.js';
    const fileName = name + '.story' + extension;
    const componentName = case_1.default.pascal(name);
    const templateComponent = new js_template_builder_1.default({ indent: { count: 1, method: 'tab' } });
    templateComponent.generateDOMElement({ tag: componentName, spreadProps: true, selfClosing: true });
    template.insertImportStatement('React', 'react');
    template.insertImportStatement(componentName, `./${name}${extension}`);
    template.exportStatement(`{\n    title: 'Components/${componentName}',\n    component: ${componentName}\n}`, true, undefined, { newLine: { beforeCount: 1 } });
    template.generateFunction({
        name: 'Template',
        args: ['args'],
        arrow: true,
        content: templateComponent.toString(),
        body: false,
        insertOptions: {
            newLine: {
                beforeCount: 2,
            },
        },
    });
    template.exportStatement(`const Primary = Template.bind({})`, false, undefined, {
        newLine: { beforeCount: 1 },
    });
    template.insert(`Primary.args = {\n\n};`, { newLine: { beforeCount: 2 } });
    fs_1.default.writeFileSync(path_1.default.resolve(componentPath, fileName), template.toString(), { encoding: 'utf-8' });
}
exports.default = { create };
