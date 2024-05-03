const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
const config = JSON.parse(fs.readFileSync('./config.json'));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('CM anti-nuke', { type: 'WATCHING' });
});

client.on('message', async message => {
  if (!message.guild || message.author.bot) return;

  const isNuke = checkForNuke(message);
  if (isNuke) {
    message.delete();
    message.channel.send('Nuke was detected. Changes has been blocked.');

    // Dodaj funkcję banowania użytkownika
    message.member.ban({ reason: 'Try of server nuke.' })
      .then(member => {
        console.log(`Banned user: ${member.user.tag}`);
      })
      .catch(err => {
        console.error(`Can't ban user: ${err}`);
      });
  }
});

function checkForNuke(message) {
  const recentMessages = message.channel.messages.cache.filter(msg => msg.author.id === message.author.id && (Date.now() - msg.createdTimestamp) < 10000);
  return recentMessages.size > 10;
}

client.login(config.token);
