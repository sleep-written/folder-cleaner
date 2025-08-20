import type { Byte } from '@utils/byte/index.ts';

export interface ProgramParamsObject {
    execute: boolean | null;
    sizeLimit: Byte | null;
    targetDir: string | null;
    extensions: string[] | null;
}
