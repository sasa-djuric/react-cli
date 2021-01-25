// Libs
import casing from 'case';

// Base
import BaseComponentTypeTemplate from './base.component.type.template';

class FunctionalComponentTemplate extends BaseComponentTypeTemplate {
	build() {
		const pascalName = casing.pascal(this.name);
		let implementsInterface = null;

		if (this.typescript) {
			const interfaceName = pascalName + 'Props';

			implementsInterface = `React.FunctionComponent<${interfaceName}>`;

			this.template
				.insertNewLine()
				.insertInterface({
					name: interfaceName,
				})
				.insertNewLine();
		}

		this.template.insertNewLine().insertFunction({
			name: pascalName,
			arrow: true,
			immidiateReturn: true,
			interfaceName: implementsInterface,
			content: this.element,
		});
	}
}

export default FunctionalComponentTemplate;
