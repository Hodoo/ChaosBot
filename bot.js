// init project
var express = require('express');
var app = express();
const http = require('http');
const Discord = require("discord.js");
const fs = require("fs")
const config = require("./data/config.json");
const serverdefault = require("./data/server-default.json");
const client = new Discord.Client();
var pkginfo = require('pkginfo')(module, 'version');
var version = module.exports.version;

// RegEx  Patterns
var chanPattern = /<#(\d+)>/;

// Start of Glitch section to keep app from sleeping, not needed if self-hosting
// Listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log("Listening on port " + listener.address().port);
});
// Print received pings to console
app.get("/", (request, response) => {
  console.log(`${Date.now()}: Ping Received`);
  response.sendStatus(200);
});
// Ping self every 280 seconds to keep alive
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
// End of Glitch section


// Bot start
client.on("ready", () => {
  client.user.setActivity('your votes', { type: 'WATCHING' });
  console.log(`ChaosBot version: ${version}`);
  console.log("ChaosBot is running");
});

client.on("guildCreate", (guild) => {
  console.log(Date.now() + ": JOINED: " + guild.name + " (" + guild.id + ")");
  var newserver = serverdefault;
  newserver.ownerID = guild.ownerID;
  fs.writeFile(`./data/servers/${guild.id}.json`, JSON.stringify(newserver), (err) => console.error);
});

client.on("message", (message) => {

/*
  console.log(message.content);
*/

  // Get information from server's json
  var server = require(`./data/servers/${message.guild.id}.json`);

  // Ignore messages from bots
  if (message.author.bot) return;

  // Command to change server prefix
  if(message.content.startsWith(server.prefix + "prefix")) {
    if(message.author.id !== server.ownerID) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    // change the server configuration in memory
    server.prefix = newPrefix;
    message.channel.send(`Prefix changed to: ${server.prefix}`).catch(logSendError);
    // Now we have to save the file.
    fs.writeFile(`./data/servers/${message.guild.id}.json`, JSON.stringify(server), (err) => console.error);
    return;
  }

  // Make the bot say whatever you want, wherever you want
  if(message.content.startsWith(server.prefix + "say")) {
    if(message.author.id !== server.ownerID) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    // If message starts with a channel mention, try to send message there
    if (message.content.split(" ", 2)[1].startsWith("<#")) {
      let channel = message.guild.channels.find('id', chanPattern.exec(message.content.split(" ", 2)[1])[1]);
      if (!channel) {
        message.channel.send("Channel not found.").catch(logSendError);
        return;
      }
      let newmsg = message.content.slice(27);
      channel.send(newmsg).catch(logSendError);
    }
    // Otherwise, send message in current channel
    else {
      let newmsg = message.content.slice(5);
      message.channel.send(newmsg).catch(logSendError);
    }
    return;
  }

  // Command to return current version number
  if(message.content.startsWith(server.prefix + "version")) {
    message.channel.send(`Currently running ChaosBot v${version}`).catch(logSendError);
    return;
  }

  // Command to toggle current channel as a suggestion channel
  if(message.content.startsWith(server.prefix + "suggest")) {
    if(message.author.id !== server.ownerID) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    // Don't allow the same channel in both categories
    if (server.votingchannels.includes(message.channel.id)) {
      message.channel.send(`<#${message.channel.id}> is already a voting channel!`).catch(logSendError);
      return;
    }
    // Find the index of the current channel
    var index = server.suggestchannels.indexOf(message.channel.id);
    // If found, remove from array
    if (index > -1) {
      server.suggestchannels.splice(index, 1);
      message.channel.send(`<#${message.channel.id}> removed from suggestion channels list.`).catch(logSendError);
    } else {
    // If not found, add to array
      server.suggestchannels.push(message.channel.id);
      message.channel.send(`<#${message.channel.id}> added to suggestion channels list.`).catch(logSendError);
    }
    // Save the server config file.
    fs.writeFile(`./data/servers/${message.guild.id}.json`, JSON.stringify(server), (err) => console.error);
    return;
  }

  // Command to toggle current channel as a voting channel
  if(message.content.startsWith(server.prefix + "voting")) {
    if(message.author.id !== server.ownerID) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    // Don't allow the same channel in both categories
    if (server.suggestchannels.includes(message.channel.id)) {
      message.channel.send(`<#${message.channel.id}> is already a suggestion channel!`).catch(logSendError);
      return;
    }
    // Find the index of the current channel
    var index = server.votingchannels.indexOf(message.channel.id);
    // If found, remove from array
    if (index > -1) {
      server.votingchannels.splice(index, 1);
      message.channel.send(`<#${message.channel.id}> removed from voting channels list.`).catch(logSendError);
    } else {
    // If not found, add to array
      server.votingchannels.push(message.channel.id);
      message.channel.send(`<#${message.channel.id}> added to voting channels list.`).catch(logSendError);
    }
    // Save the server config file.
    fs.writeFile(`./data/servers/${message.guild.id}.json`, JSON.stringify(server), (err) => console.error);
    return;
  }



  /*
  Make sure to keep the following sections at the end, to prevent processing emojis on commands
  */

  // Check if posted in a voting channel
  if (server.votingchannels.includes(message.channel.id)) {
  // Extract custom emojis from message if present
    var myRegEx = /<:\w+:(\d+)>/g;
    var matchedemojis = getMatches(message.content, myRegEx, 1);
  // If no emojis are present, return
    if (matchedemojis.length === 0) {return;};
  // Otherwise, react with the matched emojis
    var i = 0   // Reset iteration to 0 before starting
    // Iterate reactions through the matched emojis
    var react = setInterval(function(){
      message.react(matchedemojis[i]).catch(logReactError);
      i++;
      if(i === matchedemojis.length) {
          clearInterval(react);
      }
    }, 550);
    return;
  }

  // Check if posted in a suggestion channel
  if (server.suggestchannels.includes(message.channel.id)) {
  // Get server's :upvote: and :downvote: emojis
    const upvote = client.emojis.find("name", "upvote");
    const downvote = client.emojis.find("name", "downvote");
  // React with said emojis
    message.react(upvote.id)
      .then( () => message.react(downvote.id) )
  // Catch any errors that may occur
      .catch(logReactError);
    return;
  };

  function logSendError(reason) {
    console.log(`${Date.now()}: ERROR: ${message.guild.name}: #${message.channel.name} -- ${reason}, while attempting to send message`);
  };
  function logReactError(reason) {
    console.log(`${Date.now()}: ERROR: ${message.guild.name}: #${message.channel.name} -- ${reason}, while attempting to add reaction`);
  };

});

// Function for RegEx
function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while (match = regex.exec(string)) {
    matches.push(match[index]);
  }
  return matches;
};

client.login(config.token);
