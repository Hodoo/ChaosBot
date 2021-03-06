// init project
var express = require('express');
var app = express();
const fs = require('fs');
const Discord = require("discord.js");
const config = require("./data/config.json");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
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

if (!fs.existsSync('./data/web')){
    fs.mkdirSync('./data/web');
}
app.use(express.static('data/web'));

const cmdList = fs.readdirSync("./commands/");
client.settings.set("commandList", cmdList);
//console.log(`Loaded commands:\n${cmdList}`)

client.settings.set("address", config.address);

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


client.login(config.token);

setInterval(client.runTimers, 5000);
}());
