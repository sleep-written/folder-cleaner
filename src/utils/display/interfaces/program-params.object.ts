import type { Byte } from '@utils/byte/index.js';

export interface ProgramParamsObject {
    sizeLimit: Byte | null;
    targetDir: string | null;
    extensions: string[] | null;
}
