// Libs
import { Command } from 'commander';

abstract class BaseHighCommand {
	constructor() {}

	abstract build(): Command;
}

export default BaseHighCommand;
