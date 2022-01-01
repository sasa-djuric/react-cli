import j from 'jscodeshift';

export function constructTemplate(body: Array<any>) {
	const template = j('');
	template.get().value.program.body = body;
	return template.toSource().replace(/\n\s*\n\s*\n/g, '\n\n');
}
