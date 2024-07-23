import 'dotenv/config';
import { InstallGlobalCommands } from '../utils/discord_helpers.js';

const STICKER_COMMAND = {
  name: 'sticker',
  type: 1,
  description: 'Generate a sticker using AI!',
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      type: 3,
      name: 'prompt',
      description: 'Used for sticker generation',
      required: true
    }
  ]
};

const ALL_COMMANDS = [
  STICKER_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);