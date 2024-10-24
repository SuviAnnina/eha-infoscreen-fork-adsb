import path from 'path';
import sharp from 'sharp';
import fs, { promises as fsPromises } from 'fs';

sharp.cache(false);
sharp.concurrency(1);
const storageDir = path.join(process.cwd(), 'storage', 'radarImages');

// Main function to fetch and save all radar images
export async function fetchRadarImagesAndSave(urls, timestamps) {
    await fsPromises.mkdir(storageDir, { recursive: true });

    // Limit concurrency (optional)
    const imagePaths = await Promise.all(
        urls.map((url, index) => fetchAndSaveImage(url, timestamps[index]))
    );

    return imagePaths.filter(Boolean); // Filter out any null values
}

const fetchAndSaveImage = async (url, timestamp) => {
    const formattedTimestamp = timestamp.replace(/:/g, '-');
    const savePath = path.join(
        storageDir,
        `radar-image-${formattedTimestamp}.png`
    );

    // Check if the image already exists
    const fileExists = await fsPromises
        .access(savePath)
        .then(() => true)
        .catch(() => false);
    if (fileExists) {
        return savePath;
    }

    try {
        // Fetch the image
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(
                `Failed to fetch image from ${url}: ${res.statusText}`
            );
        }

        // Buffer the image data
        const arrayBuffer = await res.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        // Process the image to change the background to transparent
        await sharp(buffer)
            .ensureAlpha() // Ensure the image has an alpha channel
            .raw() // Process raw pixel data
            .toBuffer({ resolveWithObject: true })
            .then(({ data, info }) => {
                const { width, height, channels } = info;

                // Create a new buffer for the output image
                const outputData = Buffer.alloc(data.length);

                for (let i = 0; i < data.length; i += channels) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    // Check if the pixel matches the target background color
                    if (r === 204 && g === 204 && b === 204 && a < 255) {
                        // Set the pixel to fully transparent
                        outputData[i] = r;
                        outputData[i + 1] = g;
                        outputData[i + 2] = b;
                        outputData[i + 3] = 0; // Set alpha to 0
                    } else {
                        // Keep the original pixel
                        outputData[i] = r;
                        outputData[i + 1] = g;
                        outputData[i + 2] = b;
                        outputData[i + 3] = a; // Keep original alpha
                    }
                }

                // Save the modified image
                return sharp(outputData, { raw: { width, height, channels } })
                    .png() // Save as PNG to preserve transparency
                    .toFile(savePath);
            });
        return savePath;
    } catch (error) {
        throw new Error(
            `Error fetching or saving image for ${timestamp}`,
            error
        );
    }
};

export async function pruneOldRadarImages(newTimestamps) {
    try {
        // Read all files from the storage directory
        const files = await fs.promises.readdir(storageDir);

        if (files.length === 0) {
            console.log('No images found. Skipping pruning.');
            return; // Skip the pruning process
        }

        // Format new timestamps to match the saved filenames
        const formattedNewTimestamps = newTimestamps.map((timestamp) =>
            timestamp.replace(/:/g, '-')
        );

        // Extract timestamps from filenames
        const savedTimestamps = files
            .filter((file) => file.endsWith('.png'))
            .map((file) => {
                // Extract timestamp from filename like "radar-image-2024-10-23T05-20-00.000Z.png"
                const match = file.match(/radar-image-(.*)\.png/);
                return match ? match[1] : null;
            })
            .filter(Boolean); // Filter out any nulls in case of bad matches

        // Find timestamps to delete
        const timestampsToDelete = savedTimestamps.filter(
            (savedTimestamp) => !formattedNewTimestamps.includes(savedTimestamp)
        );

        // Delete outdated images
        await Promise.all(
            timestampsToDelete.map(async (timestamp) => {
                const filePath = path.join(
                    storageDir,
                    `radar-image-${timestamp}.png`
                );
                await fs.promises.unlink(filePath);
            })
        );
    } catch (error) {
        throw new Error('Error pruning radar images: ', error);
    }
}
