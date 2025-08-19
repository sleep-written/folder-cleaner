export interface ProcessObject {
    argv: string[];
}

export interface ArgvInjector {
    process?: ProcessObject;
}

export class Argv {
    #main: string[];
    get main(): string[] {
        return this.#main;
    }

    #flags: Record<string, string[]>;
    get flags(): Record<string, string[]> {
        const entries = Object
            .entries(this.#flags)
            .map(([ k, v ]) => [ k, v.slice() ]);

        return Object.fromEntries(entries);
    }

    constructor(inject?: ArgvInjector) {
        this.#main = [];
        this.#flags = {};

        let flag: string | undefined;
        const fragments = inject?.process?.argv ?? process.argv;
        const flagRegex = /^(?<flag>-{1,2}([a-z0-9]([\-_]*[a-z0-9]+)*)?)(=(?<value>.+))?$/i;
        for (const fragment of fragments.slice(2)) {
            if (flag === '--') {
                if (!(this.#flags[flag] instanceof Array)) {
                    this.#flags[flag] = [];
                }

                this.#flags[flag].push(fragment);

            } else {
                const groups = flagRegex.exec(fragment)?.groups as {
                    flag: string;
                    value?: string;
                } | undefined;

                if (typeof groups?.flag === 'string') {
                    flag = groups.flag.replace(/^-{1,2}/, '--');

                    if (!(this.#flags[flag] instanceof Array)) {
                        this.#flags[flag] = [];
                    }

                    if (typeof groups.value === 'string') {
                        this.#flags[flag].push(groups.value);
                        flag = undefined;

                    }

                } else if (typeof flag === 'string') {
                    this.#flags[flag].push(fragment);
                    flag = undefined;

                } else {
                    this.#main.push(fragment);

                }
            }
        }
    }
}