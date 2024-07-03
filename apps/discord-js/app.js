import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
  DiscordRequest,
  VerifyDiscordRequest,
} from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, data, message, token } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Log request bodies
  console.log(req.body);

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
      if (name === 'sticker') {
        const endpoint = 'http://flask-app:8000/inference'

        // const req = await fetch(endpoint, {
        //   method: 'POST',
        //   headers: {
        //    'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({input: "test"})
        // })

        // const data = await req.json()

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: 64,
            content: "Select a generated sticker to post!",
            embeds: [{
              image: { 
                url: "https://chatx.ai/wp-content/uploads/2023/03/Die-cut_sticker_Cute_kawaii_dinosaur_sticker_white_ba_8429429c-0cfe-492c-8373-6fcbdded.jpg.webp"
              },
            }],
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    label: 'Top Left',
                    style: 1,
                    custom_id: 'sticker_1_TL'
                  },
                  {
                    type: 2,
                    label: 'Top Right',
                    style: 1,
                    custom_id: 'sticker_2_TR'
                  },
                  {
                    type: 2,
                    label: 'Bottom Left',
                    style: 1,
                    custom_id: 'sticker_3_BL'
                  },
                  {
                    type: 2,
                    label: 'Bottom Right',
                    style: 1,
                    custom_id: 'sticker_4_BR'
                  },
                  {
                    type: 2,
                    label: 'Regenerate',
                    style: 3,
                    custom_id: 'regenerate'
                  },
                ],
              },
            ],
          },
          });
      }
  }

  if (type === InteractionType.MESSAGE_COMPONENT) { 
    const {custom_id} = data
    const {application_id} = message

    // console.log("MESSAGE COMPONENT BUTTON CLICKED")
    return res.send({ 
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      
    data: {
      embeds: [{
        image: { 
          url: "https://chatx.ai/wp-content/uploads/2023/03/Die-cut_sticker_Cute_kawaii_dinosaur_sticker_white_ba_8429429c-0cfe-492c-8373-6fcbdded.jpg.webp"
        },
        description:`${req.body.member?.user?.global_name} reacted with:`,
    }],
    },
   });
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});