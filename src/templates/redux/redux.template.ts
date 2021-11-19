import TemplateBuilder from '../../builders/base-template.builder';
import JSTemplateBuilder from '../../builders/js-template.builder';
import BaseTemplate from '../base.template';

class ReduxTemplate extends BaseTemplate {
	build(): TemplateBuilder {
		throw new Error('Method not implemented.');
	}

	include(template: JSTemplateBuilder, typescript: boolean) {
		const body = new JSTemplateBuilder().insertEmptyBody();

		template
			.insertImportStatement({
				importName: 'connect',
				type: 'destructure',
				filePath: 'react-redux',
			})
			.insertFunction({
				name: 'mapStateToProps',
				args: [`state${typescript ? ': any' : ''}`],
				arrow: true,
				immidiateReturn: true,
				content: body,
				insertOptions: {
					newLine: { beforeCount: 1 },
					insertBefore: 'export',
				},
			})
			.insertFunction({
				name: 'mapDispatchToProps',
				args: [`dispatch${typescript ? ': any' : ''}`],
				arrow: true,
				immidiateReturn: true,
				content: body,
				insertOptions: {
					newLine: { beforeCount: 1 },
					insertBefore: 'export',
				},
			})
			.wrapExport(`connect(mapStateToProps, mapDispatchToProps)`);
	}
}

export default ReduxTemplate;
