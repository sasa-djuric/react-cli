// Libs
import { Command } from 'commander';

// Base
import BaseCommand from './base.command';

class InitCommand extends BaseCommand {
	build() {
		return new Command('init')
			.description('initialize react-cli config')
			.action(() => {
				this.action.handle();
			}) as Command;
	}
}

export default InitCommand;
