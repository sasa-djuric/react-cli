#! /usr/bin/env node

// Libs
import program from 'commander';
import chalk from 'chalk';
import pacote from 'pacote';
import path from 'path';

// Configuration
import { doesConfigurationFileExists } from './configuration';
import settings from './settings';

// Utils
import { shouldCreateConfig } from './utils/configuration';

// Actions
import InitAction from './actions/init.action';
import CreateComponentAction from './actions/create/component.action';
import CreateHookAction from './actions/create/hook.action';
import CreateContextAction from './actions/create/context.action';

// Commands
import Commands from './commands';
import InitCommand from './commands/init.command';
import CreateComponentCommand from './commands/create/component.command';
import CreateHookCommand from './commands/create/hook.command';
import CreateContextCommand from './commands/create/context.command';

const packageJsonBasePath =
	process.env.NODE_ENV === 'development'
		? path.join(settings.ROOT_PATH, '../')
		: settings.ROOT_PATH;

const packageJson = require(path.join(packageJsonBasePath, 'package.json'));

async function checkConfiguration() {
	const ignoreForArgs: Record<string, boolean> = {
		'--version': true,
		'-V': true,
		'--help': true,
		'-h': true,
	};
	const isIgnored = process.argv.slice(2).some((arg) => ignoreForArgs[arg]);

	if (
		!isIgnored &&
		process.argv[process.argv.length - 1] !== 'init' &&
		!doesConfigurationFileExists()
	) {
		if (await shouldCreateConfig()) {
			await new InitAction().handle();
		}
	}
}

async function checkForUpdate(currentVersion: string) {
	try {
		const manifest = await pacote.manifest('cr-react-cli@latest');
		const latestVersion = manifest.version;

		if (currentVersion !== latestVersion) {
			const newVersionMessage = chalk.hex('F3AD38')(
				`A new version ${latestVersion} is available!`
			);
			const updateMessage = chalk.gray('Upgrade now:');
			const updateInstructionsMessage = `${updateMessage} ${chalk.green(
				`npm install -g cr-react-cli@${latestVersion}`
			)}`;
			const statement = `\n${newVersionMessage}\n${updateInstructionsMessage}\n`;

			console.log(statement);
		}
	} catch {}
}

function onException(ex: Error) {
	console.error(chalk.red(ex.message));
	process.exit();
}

(async () => {
	const commands = new Commands();

	await checkConfiguration();
	checkForUpdate(packageJson.version);

	program.version(packageJson.version).description('React CLI');
	commands.add(new InitCommand(new InitAction()));
	commands.add(new CreateComponentCommand(new CreateComponentAction()));
	commands.add(new CreateHookCommand(new CreateHookAction()));
	commands.add(new CreateContextCommand(new CreateContextAction()));
	commands.load(program);
	program.parse(process.argv);
})();

process.on('uncaughtException', onException);
process.on('unhandledRejection', onException);
