// Libs
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

let projectRoot: string;

export function getProjectRoot() {
	const currentPath = process.cwd();
	const directories = currentPath.split(path.sep);

	if (projectRoot) {
		return projectRoot;
	}

	for (let i = 0; i < directories.length; i++) {
		const currentPath = directories.join(path.sep);

		if (fs.existsSync(path.resolve(currentPath, 'package.json'))) {
			projectRoot = currentPath;
			return currentPath;
		}

		directories.pop();
	}

	throw new Error('Project not found');
}

function shouldCreateDirectory(directory: string) {
	return inquirer
		.prompt({
			name: 'shouldCreate',
			type: 'confirm',
			message: `${directory} directory does not exist. Do you want to create it?`,
		})
		.then((result) => result.shouldCreate);
}

export function handlePathCheck(pathForCheck: string) {
	if (fs.existsSync(path.resolve(pathForCheck))) {
		return Promise.resolve();
	} else if (fs.existsSync(path.resolve(pathForCheck, '../'))) {
		return shouldCreateDirectory(path.basename(pathForCheck)).then((shouldCreate) => {
			if (shouldCreate) {
				return fs.mkdirSync(pathForCheck);
			}
		});
	}

	return Promise.reject(new Error("Path doesn't exist"));
}

function existingFileActionPrompt(file: string) {
	return inquirer.prompt({
		name: 'action',
		type: 'list',
		message: `File ${chalk.cyan(file)} already exists. Pick an action:`,
		choices: [
			{
				name: 'Overwrite',
				value: 'overwrite',
			},
			{
				name: 'Cancel',
				value: 'cancel',
			},
		],
	});
}

export async function handleFileCheck(filePath: string) {
	if (fs.existsSync(filePath)) {
		const { action } = await existingFileActionPrompt(path.parse(filePath).base);

		if (action === 'overwrite') {
			return;
		} else if (action === 'cancel') {
			process.exit();
		}
	}
}

export function removeExtension(str: string) {
	const index = str.lastIndexOf('.');
	return index >= 0 ? str.substr(0, index) : str;
}
