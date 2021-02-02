#! /usr/bin/env node

// Libs
import program from 'commander';
import chalk from 'chalk';

// Configuration
import { doesConfigurationFileExists } from './configuration';

// Utils
import { shouldCreateConfig } from './utils/configuration';

// Actions
import InitAction from './actions/init.action';
import CreateComponentAction from './actions/create/component.action';
import CreateHookAction from './actions/create/hook.action';

// Commands
import Commands from './commands';
import InitCommand from './commands/init.command';
import CreateComponentCommand from './commands/create/component.command';
import CreateHookCommand from './commands/create/hook.command';

async function checkConfiguration() {
	if (
		process.argv[process.argv.length - 1] !== 'init' &&
		!doesConfigurationFileExists()
	) {
		if (await shouldCreateConfig()) {
			await new InitAction().handle();
		}
	}
}

function onException(ex: Error) {
	console.error(chalk.red(ex.message));
	process.exit();
}

(async () => {
	const commands = new Commands();

	await checkConfiguration();

	program.version('1.0.0').description('React CLI');
	commands.add(new InitCommand(new InitAction()));
	commands.add(new CreateComponentCommand(new CreateComponentAction()));
	commands.add(new CreateHookCommand(new CreateHookAction()));
	commands.load(program);
	program.parse(process.argv);
})();

process.on('uncaughtException', onException);
process.on('unhandledRejection', onException);
