const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const assert = require("assert");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

async function saveBase64Image(base64String, directory = 'temp') {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const filename = `${crypto.randomBytes(16).toString('hex')}.png`;

    await fs.mkdir(directory, { recursive: true });

    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, imageBuffer);

    return filePath;
}

async function query(data) {
  try {
    const response = await fetch(process.env.HF_ENDPOINT, {
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

async function test() {
    const ROW = 2;
    const COL = 2;

    await query({
        inputs: "disgusted pepe face",
        num_images: 4,
        rows: ROW,
        cols: COL,
    }).then((response) => {
        const { images, preview } = response;

        images.forEach((img) => { 
            saveBase64Image(img);
        });

        saveBase64Image(preview);

        const attachment = new AttachmentBuilder('./services/temp/a9755cb9fef518c27c62f9e8547c9a57.png');
        console.log(attachment);
    
        assert(ROW * COL == images.length, "Incorrect number of images returned");

        console.log(`# of images: ${images.length}`);
    });
}

// module.exports
module.exports = {
  saveBase64Image,
  query,
  test,
};
