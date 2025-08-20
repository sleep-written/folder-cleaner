import { ProgramParams } from '@utils/program-params/index.ts';
import { Display } from '@utils/display/index.ts';
import { Byte } from '@utils/byte/index.ts';
import { File } from '@utils/file/index.ts';

import chalk from 'chalk';

const params = new ProgramParams();
const display = new Display(params);

try {
    display.showTitle();
    display.showSeparator();
    display.showCurrentValues();

    display.showSeparator();
    display.print('Checking requeriments...');

    if (params.sizeLimit == null) {
        throw new Error(`The parameter ${chalk.underline('"Size Limit"')} is required`);
    } else {
        display.print(`→ The parameter ${chalk.underline('"Size Limit"')} is setled.`);
    }

    if (params.targetDir == null) {
        throw new Error(`The parameter ${chalk.underline('"Target Folder"')} is required`);
    } else {
        display.print(`→ The parameter ${chalk.underline('"Target Folder"')} is setled.`);
    }

    display.showSeparator();
    display.print('Checking folder...');

    let totalSize = new Byte(0);
    const files = await File.fromFolder(params.targetDir, {
        extensions: params.extensions,
        every(file) {
            totalSize = totalSize.add(file.size);
        },
    });

    display.print(p => {
        const totalSizeString = totalSize.toString({
            units: [ Byte.giga, Byte.mega, Byte.kilo ],
            decimals: 2
        });

        return `Total size: ${p.primitive(totalSizeString)}`
    });

    const filteredFiles = files
        .sort((a, b) =>
            a.birthDate.getTime() -
            b.birthDate.getTime()
        )
        .filter(x => {
            if (params.sizeLimit!.lessThan(totalSize)) {
                totalSize = totalSize.minus(x.size);
                return true;
            } else {
                return false;
            }
        });

    for (const file of filteredFiles) {
        display.print(p => {
            const size = file.size.toString({
                units: [ Byte.giga, Byte.mega, Byte.kilo ],
                decimals: 2
            });

            const sizeSeparator = ''
                .padStart(10 - size.length, ' ');

            return [
                `Birth: ${p.primitive(file.birthDate.toJSON())};`,
                `Size: ${sizeSeparator}${p.primitive(size)};`,
                `File: ${p.primitive(file.filename)}`
            ].join(' ');
        });

        if (params.execute) {
            await file.kill();
        }
    }

    display.print(p => {
        const totalSizeString = totalSize.toString({
            units: [ Byte.giga, Byte.mega, Byte.kilo ],
            decimals: 2
        });

        return `Total size: ${p.primitive(totalSizeString)}`
    });

} catch (err) {
    display.print('');
    display.showError(err as Error);

}