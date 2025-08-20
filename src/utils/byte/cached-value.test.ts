import test from 'ava';
import { CachedValue } from './cached-value.ts';

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
