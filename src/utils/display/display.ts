import type { ProgramParamsObject, ConsoleObject, Documentation } from './interfaces/index.ts';

import { Paint } from './paint.ts';
import { Byte } from '@utils/byte/index.ts';

export class Display {
    #paint = new Paint();
    #programParams: ProgramParamsObject;
    #consoleObject: ConsoleObject;
    #documentation: Documentation[] = [
        {
            title: 'Extensions',
            description: 'Only watch and delete files with this extension.',
            flags: [ '--extensions', '--exts', '--ext' ],
            value: o => o.extensions
        },
        {
            title: 'Size Limit',
            required: true,
            description: [
                'When the folder target exceeds this size, the program will deletes the oldest file.',
                `Available sizes: ` + Byte.units
                    .map(x => this.#paint.primitive(x.suffix))
                    .join(', ') + '.'
            ].join('\n'),
            flags: [ '--size-limit', '--limit' ],
            value: o => o.sizeLimit?.toString({
                units: [ Byte.tera, Byte.giga, Byte.mega, Byte.kilo ],
                decimals: 2
            })
        },
        {
            title: 'Target Folder',
            required: true,
            description: 'The folder do you want to watch.',
            flags: [ '--target-dir', '--target' ],
            value: o => o.targetDir
        },
        {
            title: 'Execute process',
            required: true,
            description: [
                'If this flag is present, the CLI will delete the files that exceeds the size limit',
                'setled. Otherwise, only shows the files without deleting them.'
            ].join('\n'),
            flags: [ '--execute', '--exec' ],
            value: o => o.execute
        }
    ];

    constructor(programParams: ProgramParamsObject, consoleObject?: ConsoleObject) {
        this.#programParams = programParams;
        this.#consoleObject = consoleObject ?? console;
    }

    showTitle(): void {
        const title = this.#paint.title(`folder-cleaner`);
        this.#consoleObject.log(`${title}`);
    }

    showCurrentValues(): void {
        let lineSkip = false;
        for (const item of this.#documentation) {
            if (lineSkip) {
                this.#consoleObject.log('');
            } else {
                lineSkip = true;
            }

            this.#consoleObject.log(
                this.#paint.subtitle(item.title) + (
                    item.required
                    ?   ' (required):'
                    :   ':'
                )
            );

            this.#consoleObject.log(item.description);
            this.#consoleObject.log(
                'Command flags:',
                item.flags
                    .map(x => this.#paint.flag(x))
                    .join(' / ')
            );

            const value = item.value(this.#programParams);
            this.#consoleObject.log(
                'Current value:',
                this.#paint.primitive(value)
            );
        }
    }

    print(value: string | ((p: Paint) => string)): void {
        const result = typeof value === 'function'
        ?   value(this.#paint)
        :   value;

        this.#consoleObject.log(result);
    }

    showSeparator(): void {
        const text = ''.padStart(75, '-');
        this.#consoleObject.log(this.#paint.separator(text));
    }

    showError(err: Error) {
        this.#consoleObject.log(this.#paint.errorTitle('APPLICATION ERROR') + ':');
        this.#consoleObject.log(err?.message ?? 'Error not identified');
    }
}