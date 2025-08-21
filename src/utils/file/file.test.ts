import type { Dirent, FileFromFolderInjector, Stats } from './interfaces/index.ts';

import { assertEquals } from '@std/assert';
import { File } from './file.ts';

Deno.test('Get current folder', async () => {
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
                case './src': {
                    const birthtime = new Date(2020, 0, 1);
                    return Promise.resolve({
                        isDirectory: () => true,
                        isFile: () => false,
                        size: 4090,
                        atime: birthtime,
                        mtime: birthtime,
                        ctime: birthtime,
                        birthtime,
                    });
                }

                case '/path/to/project/pendejo.ts': {
                    const birthtime = new Date(2025, 8, 1);
                    return Promise.resolve({
                        isDirectory: () => false,
                        isFile: () => true,
                        size: 2048,
                        atime: birthtime,
                        mtime: birthtime,
                        ctime: birthtime,
                        birthtime,
                    });
                }

                case '/path/to/project/joder.ts': {
                    const birthtime = new Date(2025, 8, 2);
                    return Promise.resolve({
                        isDirectory: () => false,
                        isFile: () => true,
                        size: 3516,
                        atime: birthtime,
                        mtime: birthtime,
                        ctime: birthtime,
                        birthtime,
                    });
                }

                case '/path/to/project/chaval.ts': {
                    const birthtime = new Date(2025, 8, 3);
                    return Promise.resolve({
                        isDirectory: () => false,
                        isFile: () => true,
                        size: 4444,
                        birthtime,
                        atime: birthtime,
                        mtime: birthtime,
                        ctime: birthtime,
                    });
                }

                default: {
                    throw new Error('Path not found');
                }
            }
        },
        rm: () => Promise.resolve()
    }

    const [ file1, file2, file3 ] = await File.fromFolder('./src', undefined, inject);

    assertEquals(file1.path, '/path/to/project/pendejo.ts');
    assertEquals(file1.size.toString(), '2048 B');
    assertEquals(file1.birthDate, new Date(2025, 8, 1));

    assertEquals(file2.path, '/path/to/project/joder.ts');
    assertEquals(file2.size.toString(), '3516 B');
    assertEquals(file2.birthDate, new Date(2025, 8, 2));

    assertEquals(file3.path, '/path/to/project/chaval.ts');
    assertEquals(file3.size.toString(), '4444 B');
    assertEquals(file3.birthDate, new Date(2025, 8, 3));
});
