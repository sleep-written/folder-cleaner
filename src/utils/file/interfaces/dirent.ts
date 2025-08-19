export interface Dirent {
    parentPath: string;
    isFile(): boolean;
    name: string;
}
