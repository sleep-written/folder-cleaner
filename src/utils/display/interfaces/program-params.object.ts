import type { Byte } from '@utils/byte/index.ts';

export interface ProgramParamsObject {
    execute: boolean | null;
    sizeLimit: Byte;
    targetDir: string;
    extensions: string[] | null;
}
