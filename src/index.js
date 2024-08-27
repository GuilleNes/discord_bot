require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

// Initialize the client with necessary intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

// Handling interaction creation for slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'hey') {
      return interaction.reply('hey!');
    }

    if (interaction.commandName === 'ping') {
      return interaction.reply('Pong!');
    }

    if (interaction.commandName === 'showmodal') {
      // Creating the modal
      const modal = new ModalBuilder()
        .setCustomId(`myModal-${interaction.user.id}`)
        .setTitle('Bienvenido!!');

      const userEmailInput = new TextInputBuilder()
        .setCustomId('userEmailInput')
        .setLabel('Por favor introduce tu email')
        .setStyle(TextInputStyle.Short);

      const firstActionRow = new ActionRowBuilder().addComponents(userEmailInput);

      modal.addComponents(firstActionRow);

      // Showing the modal to the user
      await interaction.showModal(modal);
    }
  }

  // Handling the modal submission
  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('myModal')) {
      try {
        // Attempt to access the input value
        const email = interaction.fields.getTextInputValue('userEmailInput');
        console.log({ email });

        await interaction.reply({ content: `Email received: ${email}`, ephemeral: true });
      } catch (error) {
        console.error('Error accessing modal input fields:', error);
        await interaction.reply({ content: 'There was an error processing your input.', ephemeral: true });
      }
    }
  }
});

// Logging in the bot
client.login(process.env.TOKEN);
