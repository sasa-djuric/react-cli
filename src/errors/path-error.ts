class PathError extends Error {
	constructor(message?: string) {
		super(message || "Path doesn't exist");
	}
}

export default PathError;
