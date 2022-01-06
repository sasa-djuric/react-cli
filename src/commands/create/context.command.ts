// Libs
import { Command } from 'commander';

// Base
import BaseCommand from '../base.command';

class CreateContextCommand extends BaseCommand {
	build() {
		return new Command('context')
			.alias('ctx')
			.arguments('<name>')
			.description('create context')
			.option('-t, --typescript', 'Use typescript')
			.option('-notp, --no-typescript', "Don't use typescript")
			.option(
				'--path',
				'Specify the path for the file relative to the project source path defined in the project configuration entry'
			)
			.action((name: string, params: any) => {
				const inputs = { name };
				const options = this.parseOptions(params);

				this.action.handle(inputs, options);
			}) as Command;
	}
}

export default CreateContextCommand;
