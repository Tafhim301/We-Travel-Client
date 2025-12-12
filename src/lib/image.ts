import imageCompression from "browser-image-compression";

const DEFAULT_MAX_SIZE_BYTES = 3.5 * 1024 * 1024; // ~3.5MB to stay under Vercel limit

export const MAX_UPLOAD_BYTES = DEFAULT_MAX_SIZE_BYTES;

export type CompressOptions = {
    quality?: number; // 0 - 1 (initialQuality for the library)
    maxWidth?: number;
    maxHeight?: number;
    maxSizeMB?: number; // Optional explicit target MB
};

// High-quality client-side image compression.
// Tries browser-image-compression first (better quality/size),
// falls back to lightweight canvas if unavailable.
export async function compressImageFile(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const {
        quality = 0.72,
        maxWidth = 1200,
        maxHeight = 1200,
        maxSizeMB = undefined,
    } = options;

    if (typeof window === "undefined" || typeof document === "undefined") {
        return file;
    }

    // Try preferred library for better quality/size balance
    try {
      
        const compressed = await imageCompression(file, {
            maxSizeMB: maxSizeMB ?? 3.4, // keep below Vercel ~4MB limit
            maxWidthOrHeight: Math.max(maxWidth, maxHeight),
            useWebWorker: true,
            initialQuality: quality,
            fileType: file.type?.startsWith("image/") ? file.type : "image/jpeg",
        });

        return compressed as File;
    } catch (err) {
        console.warn("browser-image-compression unavailable, using canvas fallback", err);
    }

    // Fallback: canvas-based compression
    return compressWithCanvas(file, { quality, maxWidth, maxHeight });
}

// Lightweight canvas fallback to avoid import failures
async function compressWithCanvas(
    file: File,
    options: { quality: number; maxWidth: number; maxHeight: number }
): Promise<File> {
    const { quality, maxWidth, maxHeight } = options;

    const dataUrl = await readFileAsDataURL(file);

    return new Promise<File>((resolve) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(file);
                return;
            }

            let { width, height } = img;
            const scale = Math.min(maxWidth / width, maxHeight / height, 1);
            width = Math.round(width * scale);
            height = Math.round(height * scale);

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const targetType = file.type?.startsWith("image/") ? file.type : "image/jpeg";

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    const compressed = new File([blob], file.name, {
                        type: targetType,
                        lastModified: Date.now(),
                    });

                    resolve(compressed);
                },
                targetType,
                quality
            );
        };

        img.onerror = () => resolve(file);
        img.src = dataUrl;
    });
}

async function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}
