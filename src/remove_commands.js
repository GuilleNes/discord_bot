require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Fetching registered commands...');

    const commands = await rest.get(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      )
    );

    // Log all commands to check their IDs and names
    console.log('Registered Commands:', commands);

    // Delete specific command by ID
    for (const command of commands) {
      if (command.name === 'showmodal') { // Change this to match the command name you want to delete
        await rest.delete(
          Routes.applicationGuildCommand(
            process.env.CLIENT_ID,
            process.env.GUILD_ID,
            command.id
          )
        );
        console.log(`Deleted command: ${command.name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
