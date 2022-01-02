import chalk from 'chalk';
import { getProjectRoot } from '../utils/path';

export const createMessage = (filePath: string) =>
	console.log(chalk.green('CREATE'), filePath.substring(getProjectRoot().length + 1));

export const updateMessage = (filePath: string) =>
	console.log(chalk.yellow('UPDATE'), filePath.substring(getProjectRoot().length + 1));
