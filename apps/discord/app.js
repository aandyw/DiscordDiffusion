import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
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
  const { type, data } = req.body;

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

        const req = await fetch(endpoint, {
          method: 'POST',
          headers: {
           'Content-Type': 'application/json'
          },
          body: JSON.stringify({input: "test"})
        })

        const data = await req.json()

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [{
              image: { 
                url: data.image_url
              },
              description: "This is a test sticker from the Sticker Generation Bot!"
            }]
          },
        });
      }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
