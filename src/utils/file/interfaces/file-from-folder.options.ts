import type { File } from '../file.js';

export interface FileFromFolderOptions {
    extensions?: string[] | null;
    every?: ((file: File) => void | Promise<void>) | null;
}