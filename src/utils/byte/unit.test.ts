import test from 'ava';
import { Unit } from './unit.js';

test('1536n → 1.5', t => {
    const unit = new Unit('kilo de pendejos', 'kPe', 1024, 1);
    const resp = unit
        .to(1536n)
        .toNumber();

    t.is(resp, 1.5);
});

test('5_767_168 B → 5.5 MB', t => {
    const unit = new Unit('mega', 'MB', 1024, 2);
    const resp = unit
        .to(5_767_168n)
        .toNumber();

    t.is(resp, 5.5);
});

test('-1536n → -1.5', t => {
    const unit = new Unit('kilo de pendejos', 'kPe', 1024, 1);
    const resp = unit
        .to(-1536n)
        .toNumber();

    t.is(resp, -1.5);
});

test('-5_767_168 B → -5.5 MB', t => {
    const unit = new Unit('mega', 'MB', 1024, 2);
    const resp = unit
        .to(-5_767_168n)
        .toNumber();

    t.is(resp, -5.5);
});