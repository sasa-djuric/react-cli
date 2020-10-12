"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const settings_1 = __importDefault(require("../settings"));
const utils_1 = require("../utils");
const constants_1 = require("../constants");
function detectTypescript() {
    return fs_1.default.existsSync(path_1.default.resolve(utils_1.getProjectRoot(), 'tsconfig.json'));
}
function get() {
    const fileName = 'react-config.json';
    const global = path_1.default.resolve(settings_1.default.ROOT_PATH, fileName);
    const local = path_1.default.resolve(utils_1.getProjectRoot(), fileName);
    if (fs_1.default.existsSync(local)) {
        return JSON.parse(fs_1.default.readFileSync(local, { encoding: 'utf8' }));
    }
    else if (fs_1.default.existsSync(global)) {
        return JSON.parse(fs_1.default.readFileSync(global, { encoding: 'utf8' }));
    }
    else {
        return constants_1.defaultConfig;
    }
}
function create(config, scope) {
    const fileName = 'react-config.json';
    const global = path_1.default.resolve(settings_1.default.ROOT_PATH, fileName);
    const local = path_1.default.resolve(utils_1.getProjectRoot(), fileName);
    if (scope === 'project') {
        config.project.typescript = detectTypescript();
    }
    fs_1.default.writeFileSync(scope === 'global' ? global : local, JSON.stringify(config, null, 4), {
        encoding: 'utf-8',
    });
}
exports.default = { create, get };
