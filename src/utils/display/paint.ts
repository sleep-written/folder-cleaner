import chalk from 'chalk';

export class Paint {
    flag(name: string): string {
        return chalk.grey(name);
    }

    primitive(value: any): string {
        switch (true) {
            case value === true: {
                return chalk.blue(value);
            }

            case value === false: {
                return chalk.red(value);
            }

            case typeof value === 'number': {
                return chalk.yellow(value);
            }

            case typeof value === 'string': {
                return chalk.green(`"${value}"`);
            }

            case value instanceof Array: {
                const items = value
                    .map(x => this.primitive(x))
                    .join(', ');

                return `[ ${items} ]`;
            }

            default: {
                return value;
            }
        }
    }
}