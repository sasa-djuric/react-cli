"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const case_1 = __importDefault(require("case"));
const child_process_1 = require("child_process");
// Utils
const utils_1 = require("../utils");
// Services
const style_1 = __importDefault(require("../services/style"));
const test_1 = __importDefault(require("../services/test"));
const component_1 = __importDefault(require("../services/component"));
const story_1 = __importDefault(require("../services/story"));
const config_1 = __importDefault(require("../services/config"));
function checkSubFolders(mainPath, subFolders) {
    let lastPath = mainPath;
    for (const folder of subFolders) {
        if (!fs_1.default.existsSync(path_1.default.resolve(lastPath, folder))) {
            fs_1.default.mkdirSync(path_1.default.resolve(lastPath, folder));
        }
        lastPath = lastPath + '/' + folder;
    }
}
function create(name, options, constraints) {
    const config = config_1.default.get();
    const componentName = name.lastIndexOf('/') >= 0 ? name.substr(name.lastIndexOf('/') + 1) : name;
    const namePascal = case_1.default.pascal(componentName);
    const namePreferred = case_1.default[config.component.casing](componentName);
    const subFolders = name.split('/').slice(0, name.split('/').length - 1);
    const componentPath = path_1.default.resolve(utils_1.getProjectRoot(), options.path || config.component.path, ...subFolders, config.component.inFolder ? namePreferred : '');
    const fileExtension = config.project.typescript ? '.tsx' : '.jsx';
    const filePath = path_1.default.resolve(componentPath, name + fileExtension);
    const feature = utils_1.featureToggle('component', config, options, constraints);
    try {
        checkSubFolders(path_1.default.resolve(utils_1.getProjectRoot(), config.component.path), subFolders);
        feature('inFolder', () => {
            fs_1.default.mkdirSync(componentPath);
        });
        component_1.default.create(namePreferred, componentPath, options, constraints, config);
        feature('style', () => {
            style_1.default.create(namePreferred, config.style, componentPath);
        });
        feature('index', () => {
            utils_1.makeIndexFileExport(componentPath, namePascal, namePreferred, config.project.typescript ? 'ts' : 'js');
        });
        feature('test', () => {
            test_1.default.create(namePreferred, componentPath, {
                ...config.testing,
                typescript: config.project.typescript,
            });
        });
        feature('story', () => {
            story_1.default.create(namePreferred, { typescript: config.project.typescript }, componentPath);
        });
        feature('open', () => {
            child_process_1.exec(filePath);
        });
    }
    catch (err) {
        console.log(err);
    }
}
function _delete(params) {
    console.log('delete component');
}
function rename(params) {
    console.log('rename component');
}
exports.default = { create, delete: _delete, rename };
