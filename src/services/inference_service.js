import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

// Load environment variables
dotenv.config();

export async function query(data) {
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
    const result = await response.json();
    return result;
}