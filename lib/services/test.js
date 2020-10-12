"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const case_1 = __importDefault(require("case"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function create(name, filePath, config) {
    const namePascal = case_1.default.pascal(name);
    const template = `import React from 'react';\nimport ReactDOM from 'react-dom';\nimport ${namePascal} from './${name}'\n\ndescribe('<${namePascal}/>', () => {\n    it('should ', () => {\n        expect(wrapper);\n    });\n});`;
    fs_1.default.writeFileSync(path_1.default.resolve(filePath, name + '.test' + (config.typescript ? '.tsx' : '.jsx')), template, {
        encoding: 'utf-8',
    });
}
exports.default = { create };
