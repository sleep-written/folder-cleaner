import type { Dirent, FileFromFolderInjector, Stats } from './interfaces/index.js';

import { File } from './file.js';
import test from 'ava';

test('Get current folder', async t => {
    const inject: FileFromFolderInjector = {
        readdir: () => Promise.resolve<Dirent[]>([
            {
                isFile: () => true,
                parentPath: '/path/to/project',
                name: 'pendejo.ts'
            },
            {
                isFile: () => true,
                parentPath: '/path/to/project',
                name: 'joder.ts'
            },
            {
                isFile: () => true,
                parentPath: '/path/to/project',
                name: 'chaval.ts'
            }
        ]),
        stat: (path: string): Promise<Stats> => {
            switch (path) {
                case '/path/to/project/pendejo.ts': {
                    const birthtime = new Date(2025, 8, 1);
                    return Promise.resolve({
                        size: 2048,
                        birthtime
                    });
                }

                case '/path/to/project/joder.ts': {
                    const birthtime = new Date(2025, 8, 2);
                    return Promise.resolve({
                        size: 3516,
                        birthtime
                    });
                }

                case '/path/to/project/chaval.ts': {
                    const birthtime = new Date(2025, 8, 3);
                    return Promise.resolve({
                        size: 4444,
                        birthtime
                    });
                }

                default: {
                    throw new Error('File not found');
                }
            }
        },
        rm: () => Promise.resolve()
    }

    const [ file1, file2, file3 ] = await File.fromFolder('./src', undefined, inject);

    t.is(file1.path, '/path/to/project/pendejo.ts');
    t.is(file1.size.toString(), '2048 B');
    t.deepEqual(file1.birthDate, new Date(2025, 8, 1));

    t.is(file2.path, '/path/to/project/joder.ts');
    t.is(file2.size.toString(), '3516 B');
    t.deepEqual(file2.birthDate, new Date(2025, 8, 2));

    t.is(file3.path, '/path/to/project/chaval.ts');
    t.is(file3.size.toString(), '4444 B');
    t.deepEqual(file3.birthDate, new Date(2025, 8, 3));
});
