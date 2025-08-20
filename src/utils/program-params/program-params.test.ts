import type { ArgvObject } from './program-params.ts';

import { ProgramParams } from './program-params.ts';
import { Byte } from '../byte/byte.ts';
import test from 'ava';

test('Capture "--limit 8MB" → OK', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--limit': [ '8MB' ]
        }
    };

    const parser = new ProgramParams(argv);
    t.is(
        parser.sizeLimit?.toString({ units: Byte.mega }),
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

    const parser = new ProgramParams(argv);
    t.is(parser.sizeLimit, null);
});

test('Capture "--ext js,cjs,mjs"', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--extensions': [ 'js,cjs,mjs' ]
        }
    };

    const parser = new ProgramParams(argv);
    t.deepEqual(parser.extensions, [ 'js', 'cjs', 'mjs' ]);
});

test('Capture "--execute" → true', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--execute': []
        }
    };

    const parser = new ProgramParams(argv);
    t.true(parser.execute);
});

test('Capture "--execute" → false', t => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--jajaja': []
        }
    };

    const parser = new ProgramParams(argv);
    t.false(parser.execute);
});