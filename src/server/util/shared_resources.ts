import * as path from 'path';
import {RESOURCE_REGISTRY} from "../../shared/decorators/resource";
const glob = require('glob');

export function loadSharedResources() {
    return new Promise((resolve, reject) => {
        const normalizedPath = path.resolve(__dirname, "../../", "shared/resources");
        glob(path.join(normalizedPath, '**/*.ts'), (err, files: string[]) => {
            if (err) return reject(err);
            for (const file of files) {
                const path = '../../' + file.substring(file.indexOf('shared/resources'));
                require(path);
            }
            console.log(`Registered ${Object.keys(RESOURCE_REGISTRY).length} shared resources.`);
            return resolve(true);
        });
    });
}
