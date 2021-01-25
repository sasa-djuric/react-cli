// Libs
import inquirer from 'inquirer';

export function shouldCreateConfig() {
	return inquirer
		.prompt({
			name: 'shouldCreate',
			type: 'confirm',
			message: `Configuration file does not exist. Do you want to init configuration file?`,
		})
		.then((result) => result.shouldCreate);
}
