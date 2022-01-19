import { ComponentConfig, Config, FileNamingConfig, FileNamingConfigDeprecated } from '.';

function isDepercatedFileNaming(
	fileNaming: Record<string, any>
): fileNaming is FileNamingConfigDeprecated {
	return (
		typeof fileNaming.postfix === 'string' || fileNaming.postfixDevider === 'string'
	);
}

function fileNamingMigration(fileNaming: FileNamingConfigDeprecated): FileNamingConfig {
	const config = { ...fileNaming };

	if (!config.name) {
		config.name = '{name}';
	}

	if (fileNaming.postfixDevider && fileNaming.postfix) {
		config.name += fileNaming.postfixDevider + fileNaming.postfix;
	} else if (fileNaming.postfix) {
		config.name += fileNaming.postfix;
	}

	const { postfix, postfixDevider, ...rest } = config;

	return rest;
}

export function migration(config: Config) {
	let isModified = false;

	if (isDepercatedFileNaming(config.storybook.fileNaming)) {
		isModified = true;
		config.storybook.fileNaming = fileNamingMigration(
			Object.assign({}, config.project.fileNaming, config.storybook.fileNaming)
		);
	}

	if (isDepercatedFileNaming(config.style.fileNaming)) {
		isModified = true;
		config.style.fileNaming = fileNamingMigration(
			Object.assign({}, config.project.fileNaming, config.style.fileNaming)
		);
	}

	if (isDepercatedFileNaming(config.test.fileNaming)) {
		isModified = true;
		config.test.fileNaming = fileNamingMigration(
			Object.assign({}, config.project.fileNaming, config.test.fileNaming)
		);
	}

	if (isDepercatedFileNaming(config.context.fileNaming)) {
		isModified = true;
		config.context.fileNaming = fileNamingMigration(
			Object.assign({}, config.project.fileNaming, config.context.fileNaming)
		);
	}

	if (isDepercatedFileNaming(config.hook.fileNaming)) {
		isModified = true;
		config.hook.fileNaming = fileNamingMigration(
			Object.assign({}, config.project.fileNaming, config.hook.fileNaming)
		);
	}

	const component = Object.entries(config.component).reduce<
		Record<string, ComponentConfig>
	>((acc, [componentType, typeConfig]) => {
		acc[componentType] = typeConfig;

		if (isDepercatedFileNaming(typeConfig.fileNaming)) {
			isModified = true;
			acc[componentType].fileNaming = fileNamingMigration(
				Object.assign({}, config.project.fileNaming, typeConfig.fileNaming)
			);
		}

		if (typeof (typeConfig as any).defaultExport === 'boolean') {
			acc[componentType].export = {
				...(acc[componentType].export || {}),
				default: (typeConfig as any).defaultExport,
			};

			delete (acc[componentType] as any).defaultExport;

			isModified = true;
		}

		return acc;
	}, {});

	if (typeof (config.hook as any).defaultExport === 'boolean') {
		config.hook.export = {
			...(config.hook.export || {}),
			default: (config.hook as any).defaultExport,
		};

		delete (config.hook as any).defaultExport;

		isModified = true;
	}

	if (isDepercatedFileNaming(config.project.fileNaming)) {
		isModified = true;
		config.project.fileNaming = fileNamingMigration(config.project.fileNaming);
	}

	return {
		isModified,
		config: {
			...config,
			component,
		},
	};
}
