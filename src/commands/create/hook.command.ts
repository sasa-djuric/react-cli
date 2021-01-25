// Libs
import { Command } from 'commander';

// Base
import BaseCommand from '../base.command';

class CreateHookCommand extends BaseCommand {
	build() {
		return new Command('hook <name>')
			.alias('h')
			.description('create hook')
			.option('-t, --typescript', 'Use typescript')
			.option('-notp, --no-typescript', "Don't use typescript")
			.option(
				'--path',
				'Specify the path for the file relative to the project source path defined in the project configuration entry'
			)
			.action((params: any, args: Array<string>) => {
				const inputs = { name: args[0] };
				const options = this.parseOptions(params);

				this.action.handle(inputs, options);
			}) as Command;
	}
}

export default CreateHookCommand;
