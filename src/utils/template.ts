import j, { Collection, ExpressionStatement, ImportDeclaration } from 'jscodeshift';
import { DeclarationKind } from 'ast-types/gen/kinds';

export function removeSpaceBetweenImports(source: string, isFirst = true): string {
	const importIndex = source.indexOf('import');

	if (importIndex === -1) {
		return isFirst ? source : source.startsWith('\n\n') ? source : '\n' + source;
	}

	const semiIndex = source.substring(importIndex).indexOf(';') + importIndex;
	const draft = source.substring(semiIndex + 1).startsWith('\n\n')
		? source.substring(0, semiIndex + 1) + source.substring(semiIndex + 2)
		: source;

	return (
		draft.substring(0, semiIndex + 1) +
		removeSpaceBetweenImports(draft.substring(semiIndex + 1), false)
	);
}

export function addNewLines(
	source: string,
	afterString: string,
	afterStringLength: number = afterString.length
): string {
	const afterStringIndex = source.indexOf(afterString);

	if (afterStringIndex === -1) {
		return source;
	}

	const draft = !source
		.substring(afterStringIndex + afterStringLength)
		.startsWith('\n\n')
		? source.substring(0, afterStringIndex + afterStringLength) +
		  '\n' +
		  source.substring(afterStringIndex + afterStringLength)
		: source;

	return (
		draft.substring(0, afterStringIndex + afterStringLength) +
		addNewLines(draft.substring(afterStringIndex + afterStringLength), afterString)
	);
}

export function formatTemplate(source: string) {
	return addNewLines(
		addNewLines(
			addNewLines(
				removeSpaceBetweenImports(source.replace(/\n\s*\n\s*\n/g, '\n\n')),
				'\n});'
			),
			'};'
		),
		'\n}\n',
		2
	).trim();
}

export function constructTemplate(body: Array<any>) {
	const template = j('');
	template.get().value.program.body = body;
	return template.toSource({ lineTerminator: '\n' });
}

export function addImport(root: Collection<any>, declaration: ImportDeclaration) {
	const lastImportDeclaration = root.find(j.ImportDeclaration).at(-1);

	if (lastImportDeclaration.paths().length) {
		lastImportDeclaration.get().insertAfter(declaration);
	} else {
		root.get().value.program.body.unshift(declaration);
	}
}

export function findRootNode(node: any): Collection<any> {
	const parent = node.parent.get();

	if (parent.value.type === 'Program') {
		return node;
	} else {
		return findRootNode(parent);
	}
}
