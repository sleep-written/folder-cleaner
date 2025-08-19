import { ProgramParams } from '@utils/program-params/index.js';
import { Display } from '@utils/display/index.js';
import { Byte } from '@utils/byte/index.js';
import { File } from '@utils/file/index.js';

import chalk from 'chalk';
import path from 'path';

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
    }

    if (params.targetDir == null) {
        throw new Error(`The parameter ${chalk.underline('"Target Folder"')} is required`);
    }

    display.showSeparator();
    display.print('Checking folder...');

    let totalSize = new Byte(0);
    await File.fromFolder(params.targetDir, {
        filter(dirent) {
            if (params.extensions) {
                const ext = path.extname(dirent.name).replace('.', '');
                return params.extensions.includes(ext);
            } else {
                return true;
            }
        },
        every(file) {
            totalSize = totalSize.add(file.size);
            display.print(p => {
                const path = p.primitive(file.path.replace(params.targetDir!, ''));
                const size = file.size
                    .toString({
                        units: [ Byte.giga, Byte.mega, Byte.kilo ],
                        decimals: 2
                    })
                    .padStart(10, ' ');

                return `Size: ${chalk.yellow(size)}; Path: ${path}`;
            });
        },
    });

    const totalSizeString = totalSize.toString({
        units: [ Byte.giga, Byte.mega, Byte.kilo ],
        decimals: 2
    });

    display.showSeparator();
    display.print(p => `Total size: ${p.primitive(totalSizeString)}`);

} catch (err: any) {
    display.showSeparator();
    display.showError(err);

}