import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const STICKER_COMMAND = {
  name: 'sticker',
  type: 1,
  description: 'Generate a sticker',
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [
  STICKER_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
