export class CachedValue<T> {
    #callback: () => T;
    #cache?: T;

    constructor(callback: () => T) {
        this.#callback = callback;
    }

    get(): T {
        if (typeof this.#cache === 'undefined') {
            this.#cache = this.#callback();
        }

        return this.#cache;
    }
}
