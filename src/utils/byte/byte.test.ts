import test from 'ava';
import { Byte } from './byte.js';

test('From 5 GB to 5000 MB', t => {
    const giga = new Byte(5, Byte.giga);
    const mega = giga.valueOf(Byte.mega);

    t.is(mega.toNumber(), 5000);
    t.is(giga.toString(), '5000000000 B');
    t.is(giga.toString({ units: Byte.mega }), '5000 MB');
    t.is(giga.toString({ units: Byte.giga }), '5 GB');
    t.is(giga.toString({ units: Byte.giga, decimals: 2 }), '5.00 GB');
});

test('From 5000 MB to 5 GB', t => {
    const mega = new Byte(5000, Byte.mega);
    const giga = mega.valueOf(Byte.giga);

    t.is(giga.toNumber(), 5);
    t.is(mega.toString(), '5000000000 B');
    t.is(mega.toString({ units: Byte.mega }), '5000 MB');
    t.is(mega.toString({ units: Byte.giga }), '5 GB');
    t.is(mega.toString({ units: Byte.giga, decimals: 2 }), '5.00 GB');
});

test('From 2.5 GiB to 2560 MiB', t => {
    const gib = new Byte(2.5, Byte.gibi);
    const mib = gib.valueOf(Byte.mebi);

    t.is(mib.toNumber(), 2560);
    t.is(gib.toString(), '2684354560 B');
    t.is(gib.toString({ units: Byte.mebi }), '2560 MiB');
    t.is(gib.toString({ units: Byte.gibi }), '2.5 GiB');
    t.is(gib.toString({ units: Byte.gibi, decimals: 2 }), '2.50 GiB');
});

test('From 2560 MiB to 2.5 GiB', t => {
    const mib = new Byte(2560, Byte.mebi);
    const gib = mib.valueOf(Byte.gibi);

    t.is(gib.toNumber(), 2.5);
    t.is(mib.toString(), '2684354560 B');
    t.is(mib.toString({ units: Byte.mebi }), '2560 MiB');
    t.is(mib.toString({ units: Byte.gibi }), '2.5 GiB');
    t.is(mib.toString({ units: Byte.gibi, decimals: 2 }), '2.50 GiB');
});

test('Parse "2.5GiB"', t => {
    const byte = Byte.parse('2.5GiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
});

test('"2560MiB" toString → "2.50 GiB" [ Byte.gibi, Byte.mebi, Byte.kibi ]', t => {
    const byte = Byte.parse('2560MiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
    t.is(
        byte.toString({
            units: [ Byte.gibi, Byte.mebi, Byte.kibi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

test('"2560MiB" toString → "2.50 GiB" [ Byte.kibi, Byte.mebi, Byte.gibi ]', t => {
    const byte = Byte.parse('2560MiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
    t.is(
        byte.toString({
            units: [ Byte.kibi, Byte.mebi, Byte.gibi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

test('"2560MiB" toString → "2.50 GiB" [ Byte.gibi, Byte.kibi, Byte.mebi ]', t => {
    const byte = Byte.parse('2560MiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
    t.is(
        byte.toString({
            units: [ Byte.gibi, Byte.kibi, Byte.mebi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

test('Parse "2.5 GiB"', t => {
    const byte = Byte.parse('2.5 GiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
});

test('Parse "2560 MiB"', t => {
    const byte = Byte.parse('2560 MiB');
    t.is(byte.valueOf().toNumber(), 2684354560);
});

test('Parse "2.5 gib" (ignoreCase = true)', t => {
    const byte = Byte.parse('2.5 gib', true);
    t.is(byte.valueOf().toNumber(), 2684354560);
});

test('Parse "2560 mib" (ignoreCase = true)', t => {
    const byte = Byte.parse('2560 mib', true);
    t.is(byte.valueOf().toNumber(), 2684354560);
});

test('Parse "2.5 gib" and fails (ignoreCase = false)', t => {
    t.throws(
        () => Byte.parse('2.5 gib'),
        {
            message: 'The suffix "gib" is invalid'
        }
    );
});

test('Parse "2560 mib" and fails (ignoreCase = false)', t => {
    t.throws(
        () => Byte.parse('2560 mib'),
        {
            message: 'The suffix "mib" is invalid'
        }
    );
});

test('Parse "5GB 🍆" and fails', t => {
    t.throws(
        () => Byte.parse('5GB 🍆'),
        {
            message: `The string "5GB 🍆" cannot be parsed into a \`Byte\` instance`
        }
    );
});

test('5B + 3B = 8B', t => {
    const a = new Byte(5);
    const b = new Byte(3);
    const r = a.add(b);
    t.is(r.valueOf().toNumber(), 8);
});

test('5B - 3B = 2B', t => {
    const a = new Byte(5);
    const b = new Byte(3);
    const r = a.minus(b);
    t.is(r.valueOf().toNumber(), 2);
});

test('5B - 1B - 2B = 2B', t => {
    const a = new Byte(5);
    const b = new Byte(1);
    const c = new Byte(2);
    const r = a.minus(b, c);
    t.is(r.valueOf().toNumber(), 2);
});