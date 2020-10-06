#! /usr/bin/env node

// // Libs
// import clear from 'clear';
// import figlet from 'figlet';
import program from 'commander';

import actions from './actions';
import { parseOptions } from './utils';

// clear();

function validateAction() {
	//
}

program.version('1.0.0').description('React CLI').option('-t, --test', 'T');

program
	.command('init')
	.option('-s, --style')
	.option('-r, --redux')
	.description('Initialize react-cli config')
	.action(actions.init);

program
	.command('create <type> <name>')
	.alias('cr')
	.option('-s, --style')
	.option('-r, --redux')
	.action((type, name, params) => {
		actions[type].create(name, parseOptions(params));
	});
program.command('delete component').action(actions.component.delete);
program.command('rename component').action(actions.component.rename);

program.parse(process.argv);
