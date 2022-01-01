// Libs
import fs from 'fs';
import path from 'path';

// Helpers
import { merge } from '../../utils/object';
import { fixRelativePath, handlePathCheck, removeExtension } from '../../utils/path';

// Configuration
import { ProjectConfig, loadScopeConfiguration } from '../../configuration';

// Templates
import IndexTemplate from '../../templates/index/index.template';

// Types
import Dictionary from '../../types/dictionary';

// Base
import BaseAction from '../base.action';

export interface IndexInputs {
	file: {
		importName: string;
		path: string;
	};
	configOverride?: Dictionary<any>;
	export: 'default' | 'all' | string;
}

class CreateIndexAction extends BaseAction {
	async handle(inputs?: IndexInputs, options?: Dictionary<any>) {
		const config = merge(
			options,
			inputs?.configOverride,
			loadScopeConfiguration('project')
		) as ProjectConfig;

		const parsedInputFilePath = path.parse(inputs!.file.path);
		const indexFileExtension = config.typescript ? 'ts' : 'js';

		const indexFilePath = path.resolve(
			parsedInputFilePath.dir,
			`index.${indexFileExtension}`
		);

		const relativeImportPath = removeExtension(
			path.join(
				path.relative(parsedInputFilePath.dir, parsedInputFilePath.dir),
				parsedInputFilePath.base
			)
		);

		const template = new IndexTemplate(
			fixRelativePath(relativeImportPath),
			inputs?.export!
		).build();

		await handlePathCheck(path.parse(indexFilePath).dir);
		await this.create(indexFilePath, template.toString());
	}
}

export default CreateIndexAction;
