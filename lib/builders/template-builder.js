"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indent_js_1 = __importDefault(require("indent.js"));
class TemplateBuilder {
    constructor(config, fileType) {
        this.config = config;
        this.fileType = fileType;
        this.template = '';
    }
    lineAfterIndex(content, text) {
        const index = content.lastIndexOf(text) + 1;
        const endIndex = content.substr(index).indexOf(';') + index + 2;
        return endIndex;
    }
    lineBeforeIndex(content, text) {
        const index = content.lastIndexOf(text);
        const endIndex = content.substr(0, index).lastIndexOf('\n');
        return endIndex;
    }
    insertOnIndex(content, insert, index) {
        return content.substr(0, index) + insert + content.substr(index);
    }
    indent(code) {
        const indent = new Array(this.config.indent.count)
            .fill(this.config.indent.method === 'tab' ? '\t' : ' ')
            .join('');
        return indent_js_1.default[this.fileType](code, { tabString: indent });
    }
    wrap(wrapAfterIndexOf, wrapToIndexOf, strBefore, strAfter) {
        const startIndex = this.template.indexOf(wrapAfterIndexOf) + wrapAfterIndexOf.length;
        const exportName = this.template.substr(startIndex, this.template.lastIndexOf(wrapToIndexOf) - startIndex);
        const start = this.template.substr(0, startIndex);
        const wrappedExport = strBefore + exportName + strAfter;
        const endStartIndex = startIndex + exportName.length;
        const end = this.template.substr(endStartIndex);
        const template = start + wrappedExport + end;
        this.override(template);
    }
    insert(content, options) {
        const newLineBefore = options?.newLine?.beforeCount
            ? new Array(options.newLine.beforeCount).fill('\n').join('')
            : '';
        const newLineAfter = options?.newLine?.afterCount
            ? new Array(options.newLine.afterCount).fill('\n').join('')
            : '';
        const draft = newLineBefore + content + newLineAfter;
        if (options?.insertAfter) {
            const index = this.lineAfterIndex(this.template, options.insertAfter);
            this.template = this.insertOnIndex(this.template, draft, index);
        }
        else if (options?.insertBefore) {
            const index = this.lineBeforeIndex(this.template, options?.insertBefore);
            this.template = this.insertOnIndex(this.template, draft, index);
        }
        else {
            this.template = this.template + draft;
        }
        return this.template;
    }
    override(content) {
        this.template = content;
    }
    toString() {
        return this.indent(this.template);
    }
}
exports.default = TemplateBuilder;
