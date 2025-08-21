import { ProgramParams } from '@utils/program-params/index.ts';
import { Display } from '@utils/display/index.ts';
import { Byte } from '@utils/byte/index.ts';
import { File } from '@utils/file/index.ts';

const params = new ProgramParams();
const display = new Display(params);

try {
    display.showTitle();
    display.showSeparator();
    display.showCurrentValues();

    display.showSeparator();
    display.print('Checking folder...');

    let initialSize = new Byte(0);
    const files = await File.fromFolder(params.targetDir, {
        extensions: params.extensions,
        every(file) {
            initialSize = initialSize.add(file.size);
        },
    });

    display.print('Sorting and filtering files...');
    let finalSize = new Byte(initialSize.valueOf());
    const filteredFiles = files
        .sort((a, b) =>
            a.birthDate.getTime() -
            b.birthDate.getTime()
        )
        .filter(x => {
            if (params.sizeLimit!.lessThan(finalSize)) {
                finalSize = finalSize.minus(x.size);
                return true;
            } else {
                return false;
            }
        });

    if (filteredFiles.length > 0) {
        display.showCompleted();
        display.showSeparator();
        display.print(p => params.execute
            ?   p.subtitle(`Deleting files:`)
            :   p.subtitle(`Selected files:`)
        );
    }

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
            await file.kill(true);
        }
    }

    if (filteredFiles.length > 0) {
        display.print('');
    }

    display.print(p => {
        const totalSizeString = initialSize.toString({
            units: [ Byte.giga, Byte.mega, Byte.kilo ],
            decimals: 2
        });

        const separator = ''.padEnd(10 - totalSizeString.length, ' ');
        return `Initial target folder size → ${separator}${p.primitive(totalSizeString)}`;
    });

    if (filteredFiles.length > 0) {
        display.print(p => {
            const totalSizeString = finalSize.toString({
                units: [ Byte.giga, Byte.mega, Byte.kilo ],
                decimals: 2
            });
    
            const separator = ''.padEnd(10 - totalSizeString.length, ' ');
            return `Final target folder size   → ${separator}${p.primitive(totalSizeString)}`;
        });
        
        if (params.execute) {
            display.showCompleted();
        }
    }
    
    if (
        (!params.execute) ||
        ( params.execute && filteredFiles.length === 0)
    ) {
        display.print(p => p.flag('None files has been deleted'));
    }

} catch (err) {
    display.print('');
    display.showError(err as Error);

}