import "dotenv/config";
import express from "express";
import axios from "axios";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  DiscordRequest,
  VerifyDiscordRequest,
} from "./utils/discord_helpers.js";
import { query } from "./services/inference_service.js";

const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

async function resolveDeferredMessage(token, message) {
  try {
    const url = `https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${token}/messages/@original`;

    const response = await axios({
      method: "PATCH",
      url: url,
      data: message,
    });

    return response;
  } catch (error) {
    console.log("Failed to send followup message: ", error);
  }
}

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, data, message, token } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Log request bodies
  // console.log(req.body);

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    // Defer the reply
    res.send({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: 64,
      },
    });

    if (name === "sticker") {
      const { name, type, value } = options[0]; // value -> prompt
      console.log(`INPUT PROMPT: ${value}`);

      try {
        // const response = await query({
        //   inputs: value,
        //   num_images: 4,
        //   rows: 2,
        //   cols: 2,
        // });

        // const base64EncodedImages = response.images;
        // const base64EncodedPreview = response.preview;

        // ephemeral flag set in deferred message
        const message = {
          content: "Select a generated sticker to post!",
          // embeds: [
          //   {
          //     image: {
          //       url: "https://chatx.ai/wp-content/uploads/2023/03/Die-cut_sticker_Cute_kawaii_dinosaur_sticker_white_ba_8429429c-0cfe-492c-8373-6fcbdded.jpg.webp",
          //     },
          //   },
          // ],

          // TODO: issue with attachment handling by discord-interactions as a deferred message
          attachments: [],
          components: [
            {
              type: 1,
              components: [
                { type: 2, label: "TL", style: 2, custom_id: "sticker_1" },
                { type: 2, label: "TR", style: 2, custom_id: "sticker_2" },
                { type: 2, label: "BL", style: 2, custom_id: "sticker_3" },
                { type: 2, label: "BR", style: 2, custom_id: "sticker_4" },
                { type: 2, label: "🔄", style: 2, custom_id: "refresh" },
              ],
            },
          ],
          files: [
            {
              name: "preview.jpg",
              data: null,
            },
          ],
        };

        const followupResponse = await resolveDeferredMessage(token, message);

        if (!followupResponse) {
          throw new Error("Failed to generate stickers");
        }
      } catch (error) {
        console.error("Error in sticker interaction query: ", error);

        const message = {
          content: "(×_×) sorry my brain die",
        };

        await resolveDeferredMessage(token, message);
      }
    }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { custom_id } = data;
    const { application_id, embeds, channel_id } = message;

    // this is the original image from the embed - we don't need to store! just crop!
    const originalImage = embeds[0].image.url;

    /* 
    Discord Documentation on how to respond to interactions 
    https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
    */
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: originalImage,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
