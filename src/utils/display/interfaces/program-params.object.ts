import type { Byte } from '@utils/byte/index.js';

export interface ProgramParamsObject {
    sizeLimit: Byte;
    targetDir: string;
    extensions: string[] | null;
}
