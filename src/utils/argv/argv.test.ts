import { assertEquals } from '@std/assert';
import process from 'node:process';

import { Argv } from './argv.ts';

Deno.test('Check "hello world"', () => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello',
                'world'
            ]
        }
    });

    assertEquals(argv.main, [ 'hello', 'world' ]);
    assertEquals(argv.flags, { });
});

Deno.test('Check "hello world --foo bar --nya yes"', () => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello',
                'world',
                '--foo',
                'bar',
                '--nya',
                'yes'
            ]
        }
    });

    assertEquals(argv.main, [ 'hello', 'world' ]);
    assertEquals(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes' ]
    });
});

Deno.test('Check "hello world --foo bar --nya yes ñeee joder -nyaa no!"', () => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello',
                'world',
                '--foo',
                'bar',
                '--nya',
                'yes',
                'ñeee',
                'joder',
                '--nya',
                'no!'
            ]
        }
    });

    assertEquals(argv.main, [ 'hello', 'world', 'ñeee', 'joder' ]);
    assertEquals(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes', 'no!' ]
    });
});

Deno.test('Check "hello world --foo bar --nya=yes ñeee joder -nyaa no!"', () => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello',
                'world',
                '--foo',
                'bar',
                '--nya=yes',
                'ñeee',
                'joder',
                '--nya',
                'no!'
            ]
        }
    });

    assertEquals(argv.main, [ 'hello', 'world', 'ñeee', 'joder' ]);
    assertEquals(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes', 'no!' ]
    });
});

Deno.test('Check "hello world -- --foo bar --nya yes ñeee joder -nyaa no!"', () => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello',
                'world',
                '--',
                '--foo',
                'bar',
                '--nya',
                'yes',
                'ñeee',
                'joder',
                '--nya',
                'no!'
            ]
        }
    });

    assertEquals(argv.main, [ 'hello', 'world' ]);
    assertEquals(argv.flags, {
        '--': [
            '--foo', 'bar', '--nya', 'yes',
            'ñeee', 'joder', '--nya', 'no!'
        ]
    });
});