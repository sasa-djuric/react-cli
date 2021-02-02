export function isObject(item: any) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

export function merge<T, K>(target: T = {} as T, ...sources: Array<any>): T | (T & K) {
	if (!sources.length) return target;
	const source = sources.shift() as T;

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				merge(target[key], source[key]);
			} else {
				if (key in target) continue;
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return merge(target, ...sources);
}
