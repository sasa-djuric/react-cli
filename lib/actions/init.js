"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Libs
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
// Utils
const utils_1 = require("../utils");
const defaultConfig = {
    project: {
        type: 'cra',
        typescript: false,
    },
    component: {
        path: 'src/components',
        withStyle: true,
        withStroy: false,
        withTest: false,
        withProptypes: false,
        withIndex: true,
        inFolder: true,
        casing: 'snake',
        naming: 'name',
    },
    style: {
        type: 'scss',
        modules: true,
    },
};
function project() {
    return inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Project type',
            choices: constants_1.projectTypes.map(type => type.label),
        },
        { type: 'confirm', name: 'typescript', message: 'Using typescript' },
    ])
        .then(result => {
        var _a;
        result.type = (_a = constants_1.projectTypes.find(type => type.label === result.type)) === null || _a === void 0 ? void 0 : _a.name;
        return result;
    });
}
function component() {
    return inquirer_1.default
        .prompt([
        { type: 'confirm', name: 'defaultPath', message: 'Component path src/components' },
        { type: 'input', name: 'path', message: 'Component path', when: answers => !answers.defaultPath },
        { type: 'confirm', name: 'withStyle', message: 'Create style file' },
        { type: 'confirm', name: 'withStroy', message: 'Create story file' },
        { type: 'confirm', name: 'withTest', message: 'Create test file' },
        { type: 'confirm', name: 'withProptypes', message: 'Use proptypes' },
        { type: 'confirm', name: 'withIndex', message: 'Create index export file' },
        { type: 'confirm', name: 'inFloder', message: 'Create folder for component' },
        { type: 'list', name: 'casing', choices: ['kebab', 'snake', 'camel', 'pascal'] },
        { type: 'list', name: 'naming', choices: ['name', 'index'] },
    ])
        .then((results) => {
        if (results.defaultPath) {
            delete results['defaultPath'];
            results['path'] = 'src/components';
        }
        return results;
    });
}
function style() {
    return inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Styling type',
            choices: constants_1.styleTypes,
        },
        { type: 'confirm', name: 'modules', message: 'Use modules' },
    ]);
}
function Init(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {};
        const options = utils_1.parseOptions(args);
        const parts = [
            { name: 'project', prompt: project },
            { name: 'component', prompt: component },
            { name: 'style', prompt: style },
        ];
        for (const part of parts) {
            yield part
                .prompt()
                .then((answers) => {
                config[part.name] = answers;
            })
                .catch((error) => {
                if (error.isTtyError) {
                    // Prompt couldn't be rendered in the current environment
                    console.log('err');
                }
                else {
                    // Something else when wrong
                    console.log('error');
                }
                process.exit();
            });
        }
        console.log(config);
        utils_1.saveFile(path_1.default.resolve(__dirname, 'react-config.json'), config);
    });
}
exports.default = Init;
