import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

async function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await loadCommands(fullPath); // recursive call
    } else if (file.endsWith('.js')) {
      const command = await import(`file://${fullPath}`);
      if (command.default?.data) {
        commands.push(command.default.data.toJSON());
        console.log(`✅ Loaded: ${file}`);
      }
    }
  }
}

async function deploy() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    await loadCommands(path.join(__dirname, 'commands'));

    console.log('📝 Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered successfully.');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
}

deploy();
