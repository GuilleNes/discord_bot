require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');

// Initialize the client with necessary intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
  ],
});

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`); 
});

// Handle new members joining the server
client.on('guildMemberAdd', async (member) => {
  try {
    // Send a direct message to the user who just joined
    const welcomeMessage = `Bienvenido al servidor, ${member.user.username}! Por favor introduce tu email haciendo click en el botón inferior.`;

    const button = new ButtonBuilder()
      .setCustomId(`openModal-${member.user.id}`)
      .setLabel('Suscribirte')
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(button);

    await member.send({ content: welcomeMessage, components: [actionRow] });
  } catch (error) {
    console.error(`Could not send DM to ${member.user.tag}. They might have DMs disabled.`);
  }
});

// Handle interaction creation for buttons and modals
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId.startsWith('openModal')) {
      const modal = new ModalBuilder()
        .setCustomId(`myModal-${interaction.user.id}`)
        .setTitle('Bienvenido!!');

      const userEmailInput = new TextInputBuilder()
        .setCustomId('userEmailInput')
        .setLabel('Por favor introduce tu email')
        .setStyle(TextInputStyle.Short);

      const firstActionRow = new ActionRowBuilder().addComponents(userEmailInput);

      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('myModal')) {
      try {
        const email = interaction.fields.getTextInputValue('userEmailInput');
        
        // Log the email and user ID
        console.log(`Email received: ${email} from User ID: ${interaction.user.id}`);

        await interaction.reply({ content: `Email recibido: ${email}`, ephemeral: true });
      } catch (error) {
        console.error('Error accessing modal input fields:', error);
        await interaction.reply({ content: 'Ha habido un error en el proceso!', ephemeral: true });
      }
    }
  }
});

// Logging in the bot
client.login(process.env.TOKEN);
