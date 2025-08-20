import chalk from 'chalk';

export class Paint {
    title(name: string): string {
        return chalk.bold
            .bgHex('#FF6F00')
            .white(name);
    }

    subtitle(name: string): string {
        return chalk.bold.underline(name);
    }

    flag(name: string): string {
        return chalk.grey(name);
    }

    separator(content: string): string {
        return chalk.grey(content);
    }

    errorTitle(name: string): string {
        return chalk.bgRed(name);
    }

    primitive(value: any): string {
        switch (true) {
            case value == null: {
                return chalk.grey('null');
            }

            case value === true: {
                return chalk.blueBright(value);
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