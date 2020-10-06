#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Libs
// import clear from 'clear';
// import figlet from 'figlet';
const commander_1 = __importDefault(require("commander"));
const actions_1 = __importDefault(require("./actions"));
const utils_1 = require("./utils");
// clear();
function validateAction() {
    //
}
commander_1.default.version('1.0.0').description('React CLI').option('-t, --test', 'T');
commander_1.default
    .command('init')
    .option('-s, --style')
    .option('-r, --redux')
    .description('Initialize react-cli config')
    .action(actions_1.default.init);
commander_1.default
    .command('create <type> <name>')
    .option('-s, --style')
    .option('-r, --redux')
    .action((type, name, params) => {
    actions_1.default[type].create(name, utils_1.parseOptions(params));
});
commander_1.default.command('delete component').action(actions_1.default.component.delete);
commander_1.default.command('rename component').action(actions_1.default.component.rename);
commander_1.default.parse(process.argv);
