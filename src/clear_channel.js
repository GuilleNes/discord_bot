require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

// Initialize the client with necessary intents
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', async () => {
  console.log(`✅ ${client.user.tag} is online.`);

  // Replace with your channel ID
  const channelId = "comienzo";
  
  const channel = client.channels.cache.get(channelId);

  if (!channel || !channel.isTextBased()) {
    console.log('Channel not found or is not a text channel.');
    return;
  }

  try {
    let fetched;
    do {
      // Fetch the last 100 messages in the channel
      fetched = await channel.messages.fetch({ limit: 100 });
      
      // Bulk delete the fetched messages
      await channel.bulkDelete(fetched, true);
      
      console.log(`Deleted ${fetched.size} messages.`);
    } while (fetched.size >= 2);
    
    console.log('Channel cleared.');
  } catch (error) {
    console.error('Error clearing the channel:', error);
  }
});


