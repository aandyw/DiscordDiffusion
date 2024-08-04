import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import assert from "assert";

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
    const response = await fetch(process.env.HUGGINGFACE_ENDPOINT, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json().then((base64Strings) => {
      if (!base64Strings) {
        throw new TypeError("Response is null or undefined");
      }

      if (!Array.isArray(base64Strings.images)) {
        throw new TypeError("Response does not contain an array of images");
      }

      if (base64Strings.images.length === 0) {
        throw new RangeError("No images were generated");
      }

      return base64Strings;
    });
  } catch (error) {
    console.error("Error making call to inference endpoint: ", error);
    throw error;
  }
}

// TESTING FUNCTION

// async function test() {
//     const ROW = 2
//     const COL = 2

//     await query({
//         inputs: "disgusted pepe face",
//         num_images: 4,
//         rows: ROW,
//         cols: COL,
//     }).then((response) => {
//         const { images, preview } = response;

//         assert(ROW * COL == images.length, "Incorrect number of images returned")

//         console.log(`# of images: ${images.length}`);
//     });
// }

// test();
