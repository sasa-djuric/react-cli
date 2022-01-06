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
			.option('-cp, --customProvider', 'Use custom provider')
			.option('-h, --hook', 'Create a hook')
			.option('-notp, --no-typescript', "Don't use typescript")
			.option('-nocp, --no-customProvider', "Don't use custom provider")
			.option('-noh, --no-hook', "Don't create a hook")
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
