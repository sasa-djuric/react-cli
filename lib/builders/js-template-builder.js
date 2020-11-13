"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Utils
const utils_1 = require("../utils");
// Builders
const template_builder_1 = __importDefault(require("./template-builder"));
class JSTemplateBuilder extends template_builder_1.default {
    constructor(config) {
        super(config, 'js');
    }
    insertImportStatement(importName, filePath, importAll = false, insertOptions) {
        const statement = `import ${utils_1.conditionalString(importName && importAll, '* as ')}${importName ? importName + ' from ' : ''}'${filePath}';`;
        return this.insert(statement, {
            insertAfter: 'import',
            newLine: { afterCount: 1 },
            ...insertOptions,
        });
    }
    exportStatement(exportName, defaultExport, wrapExport, insertOptions) {
        const statement = `export ${utils_1.conditionalString(defaultExport, 'default ')}${utils_1.conditionalString(wrapExport)}${wrapExport ? `(${exportName})` : exportName};`;
        return this.insert(statement, insertOptions);
    }
    generateFunction({ name, args = [], arrow = false, anonymous = false, async = false, immidiateReturn = false, body = true, interfaceName, content = '', insertOptions, }) {
        const asyncStr = async ? 'async ' : '';
        const interfaceArrow = interfaceName ? ': ' + interfaceName : '';
        const interfaceFunction = interfaceName ? `<${interfaceName}>` : '';
        const declaration = !arrow
            ? `${asyncStr}function ${interfaceFunction}${name}`
            : `const ${name}${interfaceArrow} = ${asyncStr}`;
        const contentBody = body ? `{\n${body && immidiateReturn ? 'return ' : ''}${content}\n}` : content;
        const template = `${!anonymous ? declaration : ''}(${args.join(', ')}) ${arrow ? '=> ' : ''}${contentBody}${arrow ? ';' : ''}\n`;
        return this.insert(template, insertOptions);
    }
    generateClass({ name, extendsName, methods, insertOptions }) {
        const packedMethods = methods.reduce((acc, cur, index) => {
            const packedArgs = cur.args?.join(', ') ?? '';
            const isLast = methods.length - 1 === index;
            return `${acc}${cur.name}(${packedArgs}) {\n${cur.content || ''}\n}${!isLast ? '\n\n' : ''}`;
        }, '');
        const template = `class ${name}${extendsName ? ` extends ${extendsName}` : ''} {\n${packedMethods}\n}`;
        return this.insert(template, insertOptions);
    }
    generateInterface(name, extendsName, content = {}, insertOptions) {
        const contentDraft = Object.keys(content).length &&
            JSON.stringify(content, null, 4).split('"').join('').split(',').join(';').substr(6);
        const packedContent = contentDraft ? contentDraft.substr(0, contentDraft.length - 2) + ';' : '';
        const template = `interface ${name}${extendsName} {\n${packedContent}\n}`;
        return this.insert(template, insertOptions);
    }
    generateDOMElement({ tag, props = {}, selfClosing = false, children = '', spreadProps, insertOptions, }) {
        const packedProps = Object.entries(props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
        const template = `<${tag}${packedProps ? ' ' + packedProps : ''}${spreadProps ? ' {...props} ' : ''}${selfClosing ? '/>' : '>'}${!selfClosing ? `${children}</${tag}>` : ''}`;
        return this.insert(template, insertOptions);
    }
    wrapExport(wrapper) {
        this.wrap('export default ', ';', `${wrapper}(`, ')');
    }
}
exports.default = JSTemplateBuilder;
