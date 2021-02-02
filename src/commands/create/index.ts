// Libs
import { Command } from 'commander';

// Base
import BaseHighCommand from '../base.high.command';

class CreateCommand extends BaseHighCommand {
	build(): Command {
		const command = new Command('create').alias('c').description('create template');
		return command as Command;
	}
}

export default CreateCommand;
