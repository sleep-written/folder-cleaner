import { Decimal } from 'decimal.js';
import { Unit } from './unit.ts';

const byteUnits = {
    kilo: new Unit('kilobyte', 'kB',  1000, 1),
    mega: new Unit('megabyte', 'MB',  1000, 2),
    giga: new Unit('gigabyte', 'GB',  1000, 3),
    tera: new Unit('terabyte', 'TB',  1000, 4),
    kibi: new Unit('kibibyte', 'KiB', 1024, 1),
    mebi: new Unit('mebibyte', 'MiB', 1024, 2),
    gibi: new Unit('gibibyte', 'GiB', 1024, 3),
    tebi: new Unit('tebibyte', 'TiB', 1024, 4),
};

export class Byte {
    static get kilo(): Unit { return byteUnits.kilo; }
    static get mega(): Unit { return byteUnits.mega; }
    static get giga(): Unit { return byteUnits.giga; }
    static get tera(): Unit { return byteUnits.tera; }
    static get kibi(): Unit { return byteUnits.kibi; }
    static get mebi(): Unit { return byteUnits.mebi; }
    static get gibi(): Unit { return byteUnits.gibi; }
    static get tebi(): Unit { return byteUnits.tebi; }

    static get units(): Unit[] {
        return Object.values(byteUnits);
    }

    static parse(input: string, ignoreCase?: boolean): Byte {
        input = input.trim();

        const regex = /^(?<value>-?\d+(\.\d+)?)\s*(?<suffix>[a-z]+)$/i;
        const groups = regex.exec(input)?.groups as {
            value: string;
            suffix: string;
        } | undefined;

        if (
            typeof groups?.value !== 'string' &&
            typeof groups?.suffix !== 'string'
        ) {
            throw new Error(`The string "${input}" cannot be parsed into a \`Byte\` instance`);
        }

        if (ignoreCase) {
            groups.suffix = groups.suffix.toUpperCase();
        }

        const value = new Decimal(groups.value);
        const unit = Object
            .values(byteUnits)
            .find(x => {
                if (ignoreCase) {
                    return x.suffix.toUpperCase() === groups.suffix;
                } else {
                    return x.suffix === groups.suffix;
                }
            });

        if (unit || groups.suffix === 'B') {
            return new Byte(value, unit);
        } else {
            throw new Error(`The suffix "${groups.suffix}" is invalid`);
        }
    }

    #value: Decimal;

    constructor(value: number | bigint | Decimal, from?: Unit) {
        this.#value = from instanceof Unit
        ?   from.from(value)
        :   this.#getDecimal(value);
    }

    #getDecimal(value: number | bigint | Decimal): Decimal {
        switch (true) {
            case value instanceof Decimal:
            case typeof value === 'number':
            case typeof value === 'bigint': {
                return new Decimal(value);
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
    
    valueOf(to?: Unit): Decimal {
        return to instanceof Unit
        ?   to.to(this.#value)
        :   this.#value;
    }

    toString(options?: {
        decimals?: number;
        units?: Unit | Unit[];
    }): string {
        const units = options?.units instanceof Unit
        ?   [ options.units ]
        :   options?.units ?? [];

        const unit = units
            .sort((a, b) => a.power.toNumber() - b.power.toNumber())
            .reverse()
            .find(x => this.#value.greaterThanOrEqualTo(x.power));

        const value = unit?.to(this.#value) ?? this.#value;
        const suffix = unit?.suffix ?? 'B';
        return [
            value.toFixed(options?.decimals),
            suffix
        ].join(' ');
    }

    add(...bytes: [ Byte, ...Byte[] ]): Byte {
        const value = bytes
            .map(x => x.#value)
            .reduce(
                (prev, curr) => curr.add(prev),
                this.#value
            );

        return new Byte(value);
    }

    minus(...bytes: [ Byte, ...Byte[] ]): Byte {
        const value = bytes
            .map(x => x.#value)
            .reduce(
                (prev, curr) => prev.minus(curr),
                this.#value
            );

        return new Byte(value);
    }

    lessThan(byte: Byte): boolean {
        return this.#value.lessThan(byte.#value);
    }

    lessThanOrEqualTo(byte: Byte): boolean {
        return this.#value.lessThanOrEqualTo(byte.#value);
    }

    greaterThan(byte: Byte): boolean {
        return this.#value.greaterThan(byte.#value);
    }

    greaterThanOrEqualTo(byte: Byte): boolean {
        return this.#value.greaterThanOrEqualTo(byte.#value);
    }
}