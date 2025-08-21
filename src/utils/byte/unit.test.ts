import { assertEquals } from '@std/assert';

import { Unit } from './unit.ts';

Deno.test('1536n → 1.5', () => {
    const unit = new Unit('kilo de pendejos', 'kPe', 1024, 1);
    const resp = unit
        .to(1536n)
        .toNumber();

    assertEquals(resp, 1.5);
});

Deno.test('5_767_168 B → 5.5 MB', () => {
    const unit = new Unit('mega', 'MB', 1024, 2);
    const resp = unit
        .to(5_767_168n)
        .toNumber();

    assertEquals(resp, 5.5);
});

Deno.test('-1536n → -1.5', () => {
    const unit = new Unit('kilo de pendejos', 'kPe', 1024, 1);
    const resp = unit
        .to(-1536n)
        .toNumber();

    assertEquals(resp, -1.5);
});

Deno.test('-5_767_168 B → -5.5 MB', () => {
    const unit = new Unit('mega', 'MB', 1024, 2);
    const resp = unit
        .to(-5_767_168n)
        .toNumber();

    assertEquals(resp, -5.5);
});