import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { startKeepAlive } from './keepalive.js';
import mongoose from 'mongoose';
import { startReminderScheduler } from './utils/reminderScheduler.js';

dotenv.config();
startKeepAlive();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Recursive command loader
async function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await loadCommands(fullPath); // recursive step
    } else if (file.endsWith('.js')) {
      const command = await import(pathToFileURL(fullPath).href);
      if (command.default?.data?.name) {
        client.commands.set(command.default.data.name, command.default);
      }
    }
  }
}
await loadCommands(path.join(__dirname, 'commands'));

// 📦 Events
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))) {
  const event = await import(`./events/${file}`);
  if (event.default.once) {
    client.once(event.default.name, (...args) => event.default.execute(...args, client));
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args, client));
  }
}

// 🎛 Buttons
const buttonsPath = path.join(__dirname, 'buttons');
for (const file of fs.readdirSync(buttonsPath)) {
  const button = await import(`./buttons/${file}`);
  client.buttons.set(button.default.customId, button.default);
}

// 💬 Modals
const modalsPath = path.join(__dirname, 'modals');
for (const file of fs.readdirSync(modalsPath)) {
  const modal = await import(`./modals/${file}`);
  client.modals.set(modal.default.customId, modal.default);
}

// 🚀 On Ready
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    startReminderScheduler(client); // Optional
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
