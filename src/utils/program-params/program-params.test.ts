import type { ArgvObject } from './program-params.ts';

import { ProgramParams } from './program-params.ts';
import { assertEquals,  } from '@std/assert';
import { Byte } from '../byte/byte.ts';

Deno.test('Capture "--limit 8MB" → OK', () => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--limit': [ '8MB' ]
        }
    };

    const parser = new ProgramParams(argv);
    assertEquals(
        parser.sizeLimit?.toString({ units: Byte.mega }),
        '8 MB'
    );
});

Deno.test('Capture "--joder 8MB" → FAIL', () => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--joder': [ '8MB' ]
        }
    };

    const parser = new ProgramParams(argv);
    assertEquals(parser.sizeLimit, null);
});

Deno.test('Capture "--ext js,cjs,mjs"', () => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--extensions': [ 'js,cjs,mjs' ]
        }
    };

    const parser = new ProgramParams(argv);
    assertEquals(parser.extensions, [ 'js', 'cjs', 'mjs' ]);
});

Deno.test('Capture "--execute" → true', () => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--execute': []
        }
    };

    const parser = new ProgramParams(argv);
    assertEquals(parser.execute, true);
});

Deno.test('Capture "--execute" → false', () => {
    const argv: ArgvObject = {
        main: [],
        flags: {
            '--jajaja': []
        }
    };

    const parser = new ProgramParams(argv);
    assertEquals(parser.execute, false);
});