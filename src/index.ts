#! /usr/bin/env node

// Libs
import clear from 'clear';
import program from 'commander';

// Actions
import actions from './actions';

// Services
import configService from './services/config';
import featureTogglingService from './services/feature-toggling';

function _validateType(type: string) {
	const config = configService.get();

	if (config[type] && !(type === 'project' || type === 'style')) {
		return 'component';
	}
}

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
			const typeResult = _validateType(type);

			if (typeResult) {
				actions[typeResult].create(
					name,
					featureTogglingService.parseOptions(params),
					featureTogglingService.parseConstraints(params),
					type
				);
			} else {
				console.error('Wrong create type');
			}
		});
	program.parse(process.argv);
})();
