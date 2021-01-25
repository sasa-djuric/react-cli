// Libs
import { Command } from 'commander';
import casing from 'case';

// Types
import Dictionary from '../types/dictionary';

// Base
import BaseAction from '../actions/base.action';

abstract class BaseCommand {
	constructor(protected action: BaseAction) {}

	abstract build(): Command;

	protected parseOptions(args: any): Dictionary<any> {
		return Object.values(args.options).reduce<Dictionary<any>>(
			(acc: any, optionConfig: any) => {
				const option: string = casing.camel(optionConfig.long.replace('--', ''));

				if (typeof args[option] === 'undefined') {
					return acc;
				}

				return { ...acc, [option]: args[option] };
			},
			{}
		);
	}
}

export default BaseCommand;
