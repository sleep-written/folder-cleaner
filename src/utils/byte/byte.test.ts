import { assertEquals, assertThrows } from '@std/assert';

import { Byte } from './byte.ts';

Deno.test('From 5 GB to 5000 MB', () => {
    const giga = new Byte(5, Byte.giga);
    const mega = giga.valueOf(Byte.mega);

    assertEquals(mega.toNumber(), 5000);
    assertEquals(giga.toString(), '5000000000 B');
    assertEquals(giga.toString({ units: Byte.mega }), '5000 MB');
    assertEquals(giga.toString({ units: Byte.giga }), '5 GB');
    assertEquals(giga.toString({ units: Byte.giga, decimals: 2 }), '5.00 GB');
});

Deno.test('From 5000 MB to 5 GB', () => {
    const mega = new Byte(5000, Byte.mega);
    const giga = mega.valueOf(Byte.giga);

    assertEquals(giga.toNumber(), 5);
    assertEquals(mega.toString(), '5000000000 B');
    assertEquals(mega.toString({ units: Byte.mega }), '5000 MB');
    assertEquals(mega.toString({ units: Byte.giga }), '5 GB');
    assertEquals(mega.toString({ units: Byte.giga, decimals: 2 }), '5.00 GB');
});

Deno.test('From 2.5 GiB to 2560 MiB', () => {
    const gib = new Byte(2.5, Byte.gibi);
    const mib = gib.valueOf(Byte.mebi);

    assertEquals(mib.toNumber(), 2560);
    assertEquals(gib.toString(), '2684354560 B');
    assertEquals(gib.toString({ units: Byte.mebi }), '2560 MiB');
    assertEquals(gib.toString({ units: Byte.gibi }), '2.5 GiB');
    assertEquals(gib.toString({ units: Byte.gibi, decimals: 2 }), '2.50 GiB');
});

Deno.test('From 2560 MiB to 2.5 GiB', () => {
    const mib = new Byte(2560, Byte.mebi);
    const gib = mib.valueOf(Byte.gibi);

    assertEquals(gib.toNumber(), 2.5);
    assertEquals(mib.toString(), '2684354560 B');
    assertEquals(mib.toString({ units: Byte.mebi }), '2560 MiB');
    assertEquals(mib.toString({ units: Byte.gibi }), '2.5 GiB');
    assertEquals(mib.toString({ units: Byte.gibi, decimals: 2 }), '2.50 GiB');
});

Deno.test('Parse "2.5GiB"', () => {
    const byte = Byte.parse('2.5GiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
});

Deno.test('"2560MiB" toString → "2.50 GiB" [ Byte.gibi, Byte.mebi, Byte.kibi ]', () => {
    const byte = Byte.parse('2560MiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
    assertEquals(
        byte.toString({
            units: [ Byte.gibi, Byte.mebi, Byte.kibi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

Deno.test('"2560MiB" toString → "2.50 GiB" [ Byte.kibi, Byte.mebi, Byte.gibi ]', () => {
    const byte = Byte.parse('2560MiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
    assertEquals(
        byte.toString({
            units: [ Byte.kibi, Byte.mebi, Byte.gibi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

Deno.test('"2560MiB" toString → "2.50 GiB" [ Byte.gibi, Byte.kibi, Byte.mebi ]', () => {
    const byte = Byte.parse('2560MiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
    assertEquals(
        byte.toString({
            units: [ Byte.gibi, Byte.kibi, Byte.mebi ],
            decimals: 2
        }),
        '2.50 GiB'
    );
});

Deno.test('Parse "2.5 GiB"', () => {
    const byte = Byte.parse('2.5 GiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
});

Deno.test('Parse "2560 MiB"', () => {
    const byte = Byte.parse('2560 MiB');
    assertEquals(byte.valueOf().toNumber(), 2684354560);
});

Deno.test('Parse "2.5 gib" (ignoreCase = true)', () => {
    const byte = Byte.parse('2.5 gib', true);
    assertEquals(byte.valueOf().toNumber(), 2684354560);
});

Deno.test('Parse "2560 mib" (ignoreCase = true)', () => {
    const byte = Byte.parse('2560 mib', true);
    assertEquals(byte.valueOf().toNumber(), 2684354560);
});

Deno.test('Parse "2.5 gib" and fails (ignoreCase = false)', () => {
    assertThrows(
        () => Byte.parse('2.5 gib'),
        'The suffix "gib" is invalid'
    );
});

Deno.test('Parse "2560 mib" and fails (ignoreCase = false)', () => {
    assertThrows(
        () => Byte.parse('2560 mib'),
        'The suffix "mib" is invalid'
    );
});

Deno.test('Parse "5GB 🍆" and fails', () => {
    assertThrows(
        () => Byte.parse('5GB 🍆'),
        `The string "5GB 🍆" cannot be parsed into a \`Byte\` instance`
    );
});

Deno.test('5B + 3B = 8B', () => {
    const a = new Byte(5);
    const b = new Byte(3);
    const r = a.add(b);
    assertEquals(r.valueOf().toNumber(), 8);
});

Deno.test('5B - 3B = 2B', () => {
    const a = new Byte(5);
    const b = new Byte(3);
    const r = a.minus(b);
    assertEquals(r.valueOf().toNumber(), 2);
});

Deno.test('5B - 1B - 2B = 2B', () => {
    const a = new Byte(5);
    const b = new Byte(1);
    const c = new Byte(2);
    const r = a.minus(b, c);
    assertEquals(r.valueOf().toNumber(), 2);
});