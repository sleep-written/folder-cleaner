import type { ArgvObject } from './argv-parser.js';

import { ArgvParser } from './argv-parser.js';
import { Byte } from '../byte/byte.js';
import test from 'ava';

test('Capture "--limit 8MB" → OK', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--limit': [ '8MB' ]
        }
    };

    const parser = new ArgvParser(argv);
    t.is(
        parser.limit.toString({ unit: Byte.mega }),
        '8 MB'
    );
});

test('Capture "--joder 8MB" → FAIL', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--joder': [ '8MB' ]
        }
    };

    const parser = new ArgvParser(argv);
    t.throws(
        () => parser.limit,
        { message: 'The flag "--limit" is required' }
    );
});

test('Capture "--ext js,cjs,mjs"', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--extensions': [ 'js,cjs,mjs' ]
        }
    };

    const parser = new ArgvParser(argv);
    t.deepEqual(parser.extensions, [ 'js', 'cjs', 'mjs' ]);
});