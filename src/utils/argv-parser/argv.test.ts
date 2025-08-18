import test from 'ava';
import { Argv } from './argv.js';

test('Check "hello world"', t => {
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

    t.deepEqual(argv.main, [ 'hello', 'world' ]);
    t.deepEqual(argv.flags, { });
});

test('Check "hello world --foo bar --nya yes"', t => {
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

    t.deepEqual(argv.main, [ 'hello', 'world' ]);
    t.deepEqual(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes' ]
    });
});

test('Check "hello world --foo bar --nya yes ñeee joder -nyaa no!"', t => {
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

    t.deepEqual(argv.main, [ 'hello', 'world', 'ñeee', 'joder' ]);
    t.deepEqual(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes', 'no!' ]
    });
});

test('Check "hello world --foo bar --nya=yes ñeee joder -nyaa no!"', t => {
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

    t.deepEqual(argv.main, [ 'hello', 'world', 'ñeee', 'joder' ]);
    t.deepEqual(argv.flags, {
        '--foo': [ 'bar' ],
        '--nya': [ 'yes', 'no!' ]
    });
});

test('Check "hello world -- --foo bar --nya yes ñeee joder -nyaa no!"', t => {
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

    t.deepEqual(argv.main, [ 'hello', 'world' ]);
    t.deepEqual(argv.flags, {
        '--': [
            '--foo', 'bar', '--nya', 'yes',
            'ñeee', 'joder', '--nya', 'no!'
        ]
    });
});

test('Match "hello world" with "hello :command" → OK', t => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello', 'world'
            ]
        }
    });

    const match = argv.match([ 'hello', ':command' ]);
    t.deepEqual(match, {
        data: { command: [ 'world' ] },
        tail: []
    });
});

test('Match "hello world ñeee" with "hello :command" → NULL', t => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello', 'world', 'ñeee'
            ]
        }
    });

    const match = argv.match([ 'hello', ':command' ]);
    t.is(match, null);
});

test('Match "hello world ñeee jajaja gegege jijiji" with "hello :command ..." → NULL', t => {
    const argv = new Argv({
        process: {
            argv: [
                process.argv[0],
                process.argv[1],
                'hello', 'world', 'ñeee', 'jajaja', 'gegege', 'jijiji'
            ]
        }
    });

    const match = argv.match([ 'hello', ':command', '...' ]);
    t.deepEqual(match, {
        data: { command: [ 'world' ] },
        tail: [ 'ñeee', 'jajaja', 'gegege', 'jijiji' ]
    });
});
