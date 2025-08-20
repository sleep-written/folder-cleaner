import { Decimal } from 'decimal.js';
import { CachedValue } from './cached-value.ts';

export class Unit {
    #name: string;
    get name(): string {
        return this.#name;
    }

    #suffix: string;
    get suffix(): string {
        return this.#suffix;
    }

    #base: number;
    get base(): number {
        return this.#base;
    }

    #exponent: number;
    get exponent(): number {
        return this.#exponent;
    }
    
    #power = new CachedValue(() => {
        const base = new Decimal(this.#base);
        const exp = new Decimal(this.#exponent);
        return base.pow(exp);
    });
    get power(): Decimal {
        return this.#power.get();
    }

    constructor(name: string, suffix: string, base: number, exponent: number) {
        this.#name     = name;
        this.#suffix   = suffix;
        this.#base     = base;
        this.#exponent = exponent;
    }

    #toDecimal(input: number | bigint | Decimal): Decimal {
        switch (true) {
            case typeof input === 'number':
            case typeof input === 'bigint': {
                return new Decimal(input);
            }

            case input instanceof Decimal: {
                return input;
            }

            default: {
                throw new Error(
                    [
                        'The typeof input value must be an integer,',
                        'bigint or a `Decimal` instance'
                    ].join(' ')
                );
            }
        }
    }

    from(value: number | bigint | Decimal): Decimal {
        const input = this.#toDecimal(value);
        return input.times(this.#power.get());
    }

    to(value: number | bigint | Decimal): Decimal {
        const input = this.#toDecimal(value);
        return input.dividedBy(this.#power.get());
    }
}