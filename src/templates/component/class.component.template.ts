// Libs
import casing from 'case';

// Base
import BaseComponentTypeTemplate from './base.component.type.template';

class ClassComponentTemplate extends BaseComponentTypeTemplate {
	build() {
		const pascalName = casing.pascal(this.name);
		const propsInterfaceName = `${pascalName}Props`;
		// const stateInterfaceName = `${pascalName}State`;

		if (this.typescript) {
			this.template
				.insertNewLine()
				.insertInterface({
					name: propsInterfaceName,
				})
				// .insertNewLine(2)
				// .insertInterface({
				// 	name: stateInterfaceName,
				// })
				.insertNewLine();
		}

		this.template
			.insertNewLine()
			.insertClass({
				name: pascalName,
				extendsName: 'React.Component',
				methods: [
					{
						name: 'render',
						content: this.element,
						immidiateReturn: true,
					},
				],
				extendsTypeArguments: this.typescript
					? [propsInterfaceName /*, stateInterfaceName*/]
					: undefined,
			})
			.insertNewLine();
	}
}

export default ClassComponentTemplate;
