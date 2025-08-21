import { CachedValue } from './cached-value.ts';
import { assertEquals } from '@std/assert';

Deno.test('Get calc result 5 times, execute once', () => {
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

    assertEquals(value, 40);
    assertEquals(count, 1);
});
