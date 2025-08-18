import test from 'ava';
import { CachedValue } from './cached-value.js';

test('Get calc result 5 times, execute once', t => {
    let count = 0;
    const cachedValue = new CachedValue(() => {
        count++;
        return 5 * 8;
    });

    let value: number;
    value = cachedValue.get();
    value = cachedValue.get();
    value = cachedValue.get();
    value = cachedValue.get();

    t.is(value, 40);
    t.is(count, 1);
});

test('Get async calc result 5 times, execute once', async t => {
    let count = 0;
    const cachedValue = new CachedValue(async () => {
        count++;
        return 5 * 8;
    });

    let value: number;
    value = await cachedValue.get();
    value = await cachedValue.get();
    value = await cachedValue.get();
    value = await cachedValue.get();

    t.is(value, 40);
    t.is(count, 1);
});
