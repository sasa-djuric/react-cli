"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Libs
const inquirer_1 = __importDefault(require("inquirer"));
// Constants
const constants_1 = require("../constants");
// Services
const config_1 = __importDefault(require("../services/config"));
function project(scope) {
    return inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Project type',
            choices: constants_1.projectTypes.map(type => type.label),
        },
        {
            type: 'confirm',
            name: 'typescript',
            message: 'Using typescript?',
            when: () => scope === 'global',
        },
    ])
        .then(result => {
        result.type = constants_1.projectTypes.find(type => type.label === result.type)?.name;
        return result;
    });
}
function component(scope) {
    return inquirer_1.default
        .prompt([
        { type: 'confirm', name: 'defaultPath', message: 'Component path src/components ?' },
        { type: 'input', name: 'path', message: 'Component path', when: answers => !answers.defaultPath },
        { type: 'confirm', name: 'style', message: 'Create style file?' },
        { type: 'confirm', name: 'story', message: 'Create story file?' },
        { type: 'confirm', name: 'test', message: 'Create test file?' },
        { type: 'confirm', name: 'proptypes', message: 'Use proptypes?' },
        { type: 'confirm', name: 'index', message: 'Create index export file?' },
        { type: 'confirm', name: 'inFolder', message: 'Create folder for component?' },
        { type: 'list', name: 'casing', choices: ['kebab', 'snake', 'camel', 'pascal'] },
        { type: 'list', name: 'naming', choices: ['name', 'index'] },
        {
            type: 'confirm',
            name: 'open',
            message: 'Open component file in default editor after creating?',
        },
    ])
        .then((results) => {
        if (results.defaultPath) {
            delete results['defaultPath'];
            results['path'] = 'src/components';
        }
        return results;
    });
}
function style(scope) {
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
async function Init() {
    try {
        const config = {};
        const parts = [
            { name: 'project', prompt: project },
            { name: 'component', prompt: component },
            { name: 'style', prompt: style },
        ];
        const { scope } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'scope',
                message: 'For what scope you want to make configuration?',
                choices: ['global', 'project'],
            },
        ]);
        for (const part of parts) {
            config[part.name] = await part.prompt(scope);
        }
        config_1.default.create(config, scope);
    }
    catch (error) {
        if (error.isTtyError) {
            console.log("Couldn't be rendered in the current environment");
        }
        else {
            console.log(error);
        }
    }
}
exports.default = Init;
