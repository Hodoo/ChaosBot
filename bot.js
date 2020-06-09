// init project
var express = require('express');
var app = express();
const fs = require('fs');
const Discord = require("discord.js");
const config = require("./data/config.json");
const client = new Discord.Client();
require("./functions/functions.js")(client);
var pkginfo = require('pkginfo')(module, 'version');
client.version = module.exports.version

// Set up Enmap and assign to the client
const Enmap = require("enmap");
Object.assign(client, Enmap.multi(["settings"]));

// Await database ready
(async function() {
  await Enmap.defer;
  console.log("Database is ready");

// Listen for requests, to allow monitoring for downtime
var listener = app.listen(config.port, function () {
  console.log("Listening on port " + listener.address().port);
});
// Print received pings to console and respond with OK status
app.get("/", (request, response) => {
//  console.log(`${Date.now()}: Ping Received`);
  response.sendStatus(200);
});

const cmdList = fs.readdirSync("./commands/");
client.settings.set("commandList", cmdList);
//console.log(`Loaded commands:\n${cmdList}`)

// Bot start
client.on('ready', () => require(`./events/ready.js`).run(client));

client.on('guildCreate', guild => require(`./events/guildCreate.js`).run(client, guild));
client.on('guildDelete', guild => require(`./events/guildDelete.js`).run(client, guild));

client.on('guildMemberAdd', member => require(`./events/guildMemberAdd.js`).run(client, member));
client.on('guildMemberRemove', member => require(`./events/guildMemberRemove.js`).run(client, member));

client.on('message', message => require(`./events/message.js`).run(client, message));

client.on('messageDelete', message => require(`./events/messageDelete.js`).run(client, message));

client.on('guildMemberUpdate', (...args) => require(`./events/guildMemberUpdate.js`).run(client, ...args));

client.on('messageReactionAdd', (messageReaction, user) => require(`./events/messageReaction.js`).run(client, messageReaction, user, "Add"));
client.on('messageReactionRemove', (messageReaction, user) => require(`./events/messageReaction.js`).run(client, messageReaction, user, "Remove"));

client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) {
      // Grab the channel to check the message from
      const channel = client.channels.get(packet.d.channel_id);
      // There's no need to emit if the message is cached, because the event will fire anyway for that
      if (channel.messages.has(packet.d.message_id)) return;
      // Since we have confirmed the message is not cached, let's fetch it
      channel.fetchMessage(packet.d.message_id).then(message => {
          // Emojis can have identifiers of name:id format, so we have to account for that case as well
          const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
          // This gives us the reaction we need to emit the event properly, in top of the message object
          const messageReaction = message.reactions.get(emoji);
          // Adds the currently reacting user to the reaction's users collection.
          if (messageReaction) messageReaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
          // Check which type of event it is before emitting
          if (packet.t === 'MESSAGE_REACTION_ADD') {
              client.emit('messageReactionAdd', messageReaction, client.users.get(packet.d.user_id));
          }
          if (packet.t === 'MESSAGE_REACTION_REMOVE') {
              client.emit('messageReactionRemove', messageReaction, client.users.get(packet.d.user_id));
          }
      });
    } else if (packet.t === 'MESSAGE_DELETE') {
      if (!packet.d.guild_id) return;
      const message = {"id":packet.d.id,"guild":{"id":packet.d.guild_id},"channel":{"type":"text"}}
      client.emit('messageDelete', message);
    }
});



client.login(config.token);

setInterval(client.runTimers, 5000);
}());
