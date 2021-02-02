const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.resolve('lib');

function isDirectoryEmpty(path) {
	return !fs.readdirSync(path) && fs.readdirSync(path).length;
}

function handleDistDir() {
	if (!fs.existsSync(distPath)) {
		fs.mkdirSync(distPath);
	} else if (!isDirectoryEmpty(distPath)) {
		fs.rmdirSync(distPath, { recursive: true });
	}
}

(() => {
	handleDistDir();
	execSync('tsc');
	fs.copyFileSync(path.resolve('package.json'), path.resolve(distPath, 'package.json'));
})();
