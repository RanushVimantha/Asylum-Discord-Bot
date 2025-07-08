import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { startKeepAlive } from './keepalive.js';

dotenv.config();
startKeepAlive();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath)) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

// Events
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath)) {
  const event = await import(`./events/${file}`);
  if (event.default.once) {
    client.once(event.default.name, (...args) => event.default.execute(...args, client));
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args, client));
  }
}

// Buttons
const buttonsPath = path.join(__dirname, 'buttons');
for (const file of fs.readdirSync(buttonsPath)) {
  const button = await import(`./buttons/${file}`);
  client.buttons.set(button.default.customId, button.default);
}

// Modals
const modalsPath = path.join(__dirname, 'modals');
for (const file of fs.readdirSync(modalsPath)) {
  const modal = await import(`./modals/${file}`);
  client.modals.set(modal.default.customId, modal.default);
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
