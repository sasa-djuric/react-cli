// Libs
import fs from 'fs';
import casing from 'case';
import { exec } from 'child_process';

// Actions
import CreateIndexAction, { IndexInputs } from './index.action';
import CreateStyleAction, { StyleInputs } from './style.action';
import CreateStoryAction, { StorybookInputs } from './story.action';
import CreateTestAction, { TestInputs } from './test.action';

// Helpers
import FilePath from '../../file-path';
import { merge } from '../../utils/object';
import { handleFileCheck, handlePathCheck } from '../../utils/path';
import { formatTemplate } from '../../utils/template';

// Configuration
import {
	ComponentConfig,
	getSourcePath,
	loadScopeConfiguration,
} from '../../configuration';

// Templates
import ReduxTemplate from '../../templates/redux/redux.template';
import PropTypesTemplate from '../../templates/prop-types/prop-types.template';
import ComponentTemplate from '../../templates/component/compnent.template';

// Base
import BaseAction from '../base.action';

interface Inputs {
	name: string;
	type: string;
}

export interface ComponentOptions {
	typescript?: boolean;
	redux?: boolean;
	style?: boolean;
	test?: boolean;
	story?: boolean;
	proptypes?: boolean;
	index?: boolean;
	class?: boolean;
	path?: string;
	fileName?: string;
}

class CreateComponentAction extends BaseAction {
	public async handle(inputs: Inputs, options?: ComponentOptions) {
		const scopeConfig = loadScopeConfiguration('component')[inputs.type];
		const config = merge({ ...options }, scopeConfig) as ComponentConfig;
		const compnentTypePostfix = inputs.type === 'default' ? 'component' : inputs.type;

		const path = new FilePath({
			name: inputs.name,
			fileName: options?.fileName,
			config: config,
			sourcePath: getSourcePath(),
			namePlaceholders: {
				'{componentType}': compnentTypePostfix,
				'{type}': inputs.type,
			},
			fileExtension: config.typescript ? 'tsx' : 'jsx',
		});

		const componentName = casing.pascal(path.name);

		let template = new ComponentTemplate(componentName, config).build();

		await handlePathCheck(path.baseDir);
		await handleFileCheck(path.full);

		if (config.inFolder) {
			this.createComponentFolder(path.dir);
		}

		if (config.redux) {
			template = new ReduxTemplate().include(template, config.typescript);
		}

		if (config.proptypes) {
			template = new PropTypesTemplate().include(template, componentName);
		}

		await this.create(path.full, formatTemplate(template));

		if (config.style) {
			const styleInputs: StyleInputs = {
				name: componentName,
				filePath: path.dir,
				fileName: path.name + '.' + path.ext,
				namePlaceholders: {
					'{name}': path.namePreferred,
					'{componentType}': inputs.type,
				},
				configOverride: config.override?.style,
				template,
			};

			await new CreateStyleAction().handle(styleInputs);
		}

		if (config.open) {
			exec(path.full);
		}

		if (config.index) {
			const indexInputs: IndexInputs = {
				file: {
					importName: casing.pascal(path.namePreferred),
					path: path.full,
				},
				export: config.export.default ? 'default' : 'all',
			};

			await new CreateIndexAction().handle(indexInputs);
		}

		if (config.story) {
			const storyInputs: StorybookInputs = {
				filePath: path.full,
				componentName: componentName,
				componentDefaultImport: config.export.default,
				componentType: inputs.type,
				namePlaceholders: {
					'{name}': path.namePreferred,
				},
				configOverride: config.override?.storybook,
			};

			await new CreateStoryAction().handle(storyInputs);
		}

		if (config.test) {
			const testInputs: TestInputs = {
				filePath: path.full,
				componentName: componentName,
				componentDefaultImport: config.export.default,
				namePlaceholders: {
					'{name}': path.namePreferred,
				},
				configOverride: config.override?.test,
			};

			await new CreateTestAction().handle(testInputs);
		}
	}

	private createComponentFolder(path: string) {
		if (fs.existsSync(path)) {
			return;
		}

		fs.mkdirSync(path);
	}
}

export default CreateComponentAction;
