#! /usr/bin/env node

// Libs
import clear from 'clear';
import program from 'commander';
import actions from './actions';
import { parseConstraints, parseOptions } from './utils';

(() => {
	clear();
	program.version('1.0.0').description('React CLI');
	program.command('init').description('Initialize react-cli config').action(actions.init);
	program
		.command('create <type> <name>')
		.alias('cr')
		.description('')
		.option('-s, --style')
		.option('-t, --typescript')
		.option('-r, --redux')
		.option('-p, --proptypes')
		.option('-t, --test')
		.option('-i, --index')
		.option('--story')
		.option('--class')
		.option('--path <destination>')
		.option('-nos, --no-style')
		.option('-nop, --no-proptypes')
		.option('-not, --no-test')
		.option('-noi, --no-index')
		.option('--no-story')
		.action((type, name, params) => {
			actions[type].create(name, parseOptions(params), parseConstraints(params));
		});
	program.parse(process.argv);
})();
