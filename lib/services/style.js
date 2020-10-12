"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Libs
const case_1 = __importDefault(require("case"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function create(name, config, filePath) {
    if (config.type === 'styled-components')
        return;
    const draft = `.${case_1.default.kebab(name)} {\n   \n}`;
    const styles = {
        css: {
            template: draft,
            extension: '.css',
        },
        scss: {
            template: draft,
            extension: '.scss',
        },
        saas: {
            template: `.${case_1.default.kebab(name)}\n		`,
            extension: '.saas',
        },
        less: {
            template: draft,
            extension: '.less',
        },
    };
    const filename = name + (config.modules ? '.module' : '') + styles[config.type].extension;
    const template = styles[config.type].template;
    fs_1.default.writeFileSync(path_1.default.resolve(filePath, filename), template, { encoding: 'utf-8' });
}
exports.default = { create };
