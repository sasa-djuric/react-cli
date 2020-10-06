"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const case_1 = __importDefault(require("case"));
function insertBeforeSpace(str) {
    //
}
function reduxTemplate(template) {
    // template.
}
function create(name, options) {
    const template = `import React from 'react';\n\nconst ${case_1.default.pascal(name)} = () => {\n	return <div className='${case_1.default.kebab(name)}'></div>;\n}\n\nexport default ${case_1.default.pascal(name)};`;
}
exports.default = { create };
