// Libs
import { Command } from 'commander';

// Configuration
import { loadScopeConfiguration } from '../../configuration';

// Base
import BaseCommand from '../base.command';

class CreateComponentCommand extends BaseCommand {
	build() {
		return new Command('component')
			.alias('c')
			.arguments('[type] [name]')
			.description('create component')
			.option('-s, --style', 'Create a style file')
			.option('-t, --typescript', 'Use typescript')
			.option('-r, --redux', 'Include redux')
			.option('-p, --proptypes', 'Include proptypes')
			.option('-t, --test', 'Create a test file')
			.option('-i, --index', 'Create an index file with default export')
			.option('-c, --class', 'Create a class component')
			.option(
				'-fn, --file-name <name>',
				'Specify the file name. If this argument is provided, the file naming config will be ignored'
			)
			.option('--story', 'Create a story file')
			.option(
				'--path <destination>',
				'Specify the path for the file relative to the project source path defined in the project configuration entry'
			)
			.option('-nos, --no-style', "Don't create a style file")
			.option('-nop, --no-proptypes', " Don't include proptypes")
			.option('-not, --no-test', "Don't create a test file")
			.option('-noi, --no-index', "Don't create an index file")
			.option('-notp, --no-typescript', "Don't use typescript")
			.option('-nor, --no-redux', "Don't include redux")
			.option('--no-story', "Don't create story book file")
			.action(
				async (
					type: string | undefined,
					name: string | undefined,
					params: any
				) => {
					const inputs = {
						type: 'default',
						name: type,
					};

					if (type && name) {
						inputs.type = type;
						inputs.name = name;
					}

					if (!type && !name) {
						throw new Error('Name argument is missing');
					}

					if (!this.validateType(inputs.type)) {
						throw new Error('Wrong component type');
					}

					const options = this.parseOptions(params);

					this.action.handle(inputs, options);
				}
			) as Command;
	}

	private validateType(type: string): boolean {
		const config = loadScopeConfiguration('component');

		if (config[type]) {
			return true;
		}

		return false;
	}
}

export default CreateComponentCommand;
