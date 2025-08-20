import type { File } from '../file.ts';

export interface FileFromFolderOptions {
    extensions?: string[] | null;
    every?: ((file: File) => void | Promise<void>) | null;
}