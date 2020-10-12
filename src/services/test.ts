import casing from 'case';
import fs from 'fs';
import path from 'path';

function create(name: string, filePath: string, config: any) {
	const namePascal = casing.pascal(name);
	const template = `import React from 'react';\nimport ReactDOM from 'react-dom';\nimport ${namePascal} from './${name}'\n\ndescribe('<${namePascal}/>', () => {\n    it('should ', () => {\n        expect(wrapper);\n    });\n});`;

	fs.writeFileSync(
		path.resolve(filePath, name + '.test' + (config.typescript ? '.tsx' : '.jsx')),
		template,
		{
			encoding: 'utf-8',
		}
	);
}

export default { create };
