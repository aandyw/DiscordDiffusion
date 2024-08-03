import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import assert from 'assert';

// Load environment variables
dotenv.config();

// async function saveBase64Image(base64String, directory = 'temp') {
//     const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
//     const imageBuffer = Buffer.from(base64Data, 'base64');
//     const filename = `${crypto.randomBytes(16).toString('hex')}.png`;

//     await fs.mkdir(directory, { recursive: true });

//     const filePath = path.join(directory, filename);
//     await fs.writeFile(filePath, imageBuffer);

//     return filePath;
// }

export async function query(data) {
    try {
        const response = await fetch(
            process.env.HUGGINGFACE_ENDPOINT,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json()
            .then(base64_image_strings => {
                if (!base64_image_strings || !Array.isArray(base64_image_strings.images)) {
                    throw new Error('Invalid response format');
                }

                if (base64_image_strings.images.length === 0) {
                    throw new Error('No images were generated');
                }

                return base64_image_strings;
            });
    } catch (error) {
        console.error("Error making call to inference endpoint: ", error);
        throw error;
    }
}


// TESTING FUNCTION

async function main() {
    const ROW = 2
    const COL = 2

    await query({
        inputs: "disgusted pepe face",
        num_images: 4,
        rows: ROW,
        cols: COL,
    }).then((response) => {
        const images = response.images;
        const preview = response.preview;

        assert(ROW * COL == images.length, "Incorrect number of images returned")

        console.log(`# of images: ${images.length}`);
    });
}

main();