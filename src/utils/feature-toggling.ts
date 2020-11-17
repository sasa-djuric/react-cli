function parseOptions(args: any) {
	return Object.values(args.options).reduce((acc: any, optionConfig: any) => {
		const option: string = optionConfig.long.replace('--', '');

		if (option.startsWith('no-')) {
			return acc;
		}

		return args[option] ? { ...acc, [option]: args[option] } : acc;
	}, {});
}

function parseConstraints(args: any) {
	return Object.values(args.parent.args).reduce((acc: any, arg: any) => {
		const option: string = arg.replace('--', '');

		if (!option.startsWith('no-')) {
			return acc;
		}

		return { ...acc, [option.replace('no-', '')]: true };
	}, {});
}

function toggle(
	scope: 'project' | 'component' | 'style',
	config: any,
	options: any,
	constraints: any
) {
	return (name: string, fn: Function) => {
		if ((options[name] || config[scope][name]) && !constraints[name]) {
			fn();
		}
	};
}

export default { parseOptions, parseConstraints, toggle };
