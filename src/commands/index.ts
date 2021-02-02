// Libs
import { Command, CommanderStatic } from 'commander';

// Base
import BaseCommand from './base.command';
import BaseHighCommand from './base.high.command';

class Commands {
	private commands: Array<Command> = [];

	add(command: BaseHighCommand | BaseCommand) {
		const built = command.build();

		const actions = {
			addSubCommand: (subCommand: BaseCommand) => {
				built.addCommand(subCommand.build());
				return actions;
			},
		};

		this.commands.push(built);

		return actions;
	}

	public load(program: CommanderStatic) {
		this.commands.forEach((command) => {
			program.addCommand(command);
		});
	}
}

export default Commands;
