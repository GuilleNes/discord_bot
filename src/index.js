require('dotenv').config();
const { Client, IntentsBitField, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); // Import axios for making HTTP requests

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
        const userId = interaction.user.id;

        // Get the current timestamp
        const timestamp = new Date().toISOString(); // ISO 8601 format

        // Log the email and user ID
        //console.log(`Email received: ${email} from User ID: ${userId} at ${timestamp}`);

        // Prepare the data to be sent
        let data = JSON.stringify({
          "timestamp": timestamp,
          "id_servidor": process.env.GUILD_ID,
          "userId": userId,
          "email": email
        });

        // Configure the axios request
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: process.env.URL_POST,
          headers: { 
            'llave': process.env.KEY, 
            'Content-Type': 'application/json'
          },
          data : data
        };

        // Send the POST request using axios
        axios.request(config)
        .then((response) => {
          // Log success response
          //if (response.status === 200) {
            //console.log(`Success! Status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
          //} else {
            //console.log(`Unexpected status: ${response.status}, Data: ${JSON.stringify(response.data)}`);
          //}
        })
        .catch((error) => {
          // Log error response
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Error! Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Error! No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error! Request setup failed:', error.message);
          }
        });

        // Reply to the user in Discord
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
