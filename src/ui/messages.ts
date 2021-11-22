import chalk from 'chalk';
import { getProjectRoot } from '../utils/path';

export const createMessage = (filePath: string) =>
	console.log(chalk.green('CREATE'), filePath.substr(getProjectRoot().length + 1));
