declare module 'browser-image-compression' {
    export interface Options {
        maxSizeMB?: number;
        maxWidthOrHeight?: number;
        useWebWorker?: boolean;
        initialQuality?: number;
        fileType?: string;
    }

    export default function imageCompression(file: File, options?: Options): Promise<File>;
}
