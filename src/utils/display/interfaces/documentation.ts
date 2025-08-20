import type { ProgramParamsObject } from './program-params.object.ts';

export interface Documentation {
    title: string;
    required?: boolean;
    description: string;
    flags: string[];
    value: (o: ProgramParamsObject) => any;
}