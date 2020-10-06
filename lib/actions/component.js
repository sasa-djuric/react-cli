"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const case_1 = __importDefault(require("case"));
const utils_1 = require("../utils");
function checkSubFolders(mainPath, subFolders) {
    let lastPath = mainPath;
    for (const folder of subFolders) {
        if (!fs_1.default.existsSync(path_1.default.resolve(lastPath, folder))) {
            fs_1.default.mkdirSync(path_1.default.resolve(lastPath, folder));
        }
        lastPath = lastPath + '/' + folder;
    }
}
function create(name, options) {
    const config = utils_1.getConfig();
    const componentName = name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
    const namePascal = case_1.default.pascal(componentName);
    const nameKebab = case_1.default.kebab(componentName);
    const namePreferred = case_1.default[config.component.casing](componentName);
    const subFolders = name.split('/').slice(0, name.split('/').length - 1);
    const componentPath = path_1.default.resolve(config.component.path, ...subFolders, config.component.inFolder ? namePreferred : '');
    const template = `import React from 'react';\n\nconst ${namePascal} = () => {\n	return <div className='${nameKebab}'></div>;\n}\n\nexport default ${namePascal};`;
    try {
        checkSubFolders(config.component.path, subFolders);
    }
    catch (err) {
        return;
    }
    if (config.component.inFolder) {
        fs_1.default.mkdirSync(path_1.default.resolve(config.component.path, ...subFolders, namePreferred));
    }
    fs_1.default.writeFileSync(path_1.default.resolve(componentPath, namePreferred + (config.project.typescript ? '.tsx' : '.jsx')), template, { encoding: 'utf-8' });
    if (config.component.withIndex) {
        utils_1.makeIndexFileExport(componentPath, namePascal, namePreferred, config.project.typescript ? 'ts' : 'js');
    }
}
function _delete(params) {
    console.log('delete component');
}
function rename(params) {
    console.log('rename component');
}
exports.default = { create, delete: _delete, rename };
