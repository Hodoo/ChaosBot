// init project
var express = require('express');
var app = express();
const http = require('http');
const Discord = require("discord.js");
const fs = require("fs")
const config = require("./data/config.json");
const client = new Discord.Client();
var pkginfo = require('pkginfo')(module, 'version');
var version = module.exports.version;

// Start of Glitch section to keep app from sleeping, not needed if self-hosting
// Listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log("Listening on port " + listener.address().port);
});
// Print received pings to console
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
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
  console.log("ChaosBot version: " + version);
  console.log("ChaosBot is running");
});

client.on("message", (message) => {

/*
  console.log(message.content);
*/

  // Ignore messages from bots
  if (message.author.bot) return;

  // Command to toggle current channel as a suggestion channel
  if(message.content.startsWith(config.prefix + "suggest")) {
    if(message.author.id !== config.ownerID) {
      message.channel.send("You don't have permission to use that command!");
      return;
    }
    // Don't allow the same channel in both categories
    if (config.votingchannels.includes(message.channel.id)) {
      message.channel.send("<#" + message.channel.id + "> is already a voting channel!")
      return;
    }
    // Find the index of the current channel
    var index = config.suggestchannels.indexOf(message.channel.id);
    // If found, remove from array
    if (index > -1) {
      config.suggestchannels.splice(index, 1);
      message.channel.send("<#" + message.channel.id + "> removed from suggestion channels list.");
    } else {
    // If not found, add to array
      config.suggestchannels.push(message.channel.id);
      message.channel.send("<#" + message.channel.id + "> added to suggestion channels list.");
    }
    // Save the config file.
    fs.writeFile("./data/config.json", JSON.stringify(config), (err) => console.error);
    return;
  }

  // Command to toggle current channel as a voting channel
  if(message.content.startsWith(config.prefix + "voting")) {
    if(message.author.id !== config.ownerID) {
      message.channel.send("You don't have permission to use that command!");
      return;
    }
    // Don't allow the same channel in both categories
    if (config.suggestchannels.includes(message.channel.id)) {
      message.channel.send("<#" + message.channel.id + "> is already a suggestion channel!")
      return;
    }
    // Find the index of the current channel
    var index = config.votingchannels.indexOf(message.channel.id);
    // If found, remove from array
    if (index > -1) {
      config.votingchannels.splice(index, 1);
      message.channel.send("<#" + message.channel.id + "> removed from voting channels list.");
    } else {
    // If not found, add to array
      config.votingchannels.push(message.channel.id);
      message.channel.send("<#" + message.channel.id + "> added to voting channels list.");
    }
    // Save the config file.
    fs.writeFile("./data/config.json", JSON.stringify(config), (err) => console.error);
    return;
  }

  // Check if posted in a voting channel
  if (config.votingchannels.includes(message.channel.id)) {
  // Extract custom emojis from message if present
    var myRegEx = /<:\w+:(\d+)>/g;
    var matchedemojis = getMatches(message.content, myRegEx, 1);
  // If no emojis are present, return
    if (matchedemojis.length === 0) {return;};
  // Otherwise, react with the matched emojis
    var i = 0   // Reset iteration to 0 before starting
    // Iterate reactions through the matched emojis
    var react = setInterval(function(){
      message.react(matchedemojis[i])
      i++;
      if(i === matchedemojis.length) {
          clearInterval(react);
      }
    }, 550);
  }

  // Check if posted in a suggestion channel
  if (config.suggestchannels.includes(message.channel.id)) {
  // Get server's :upvote: and :downvote: emojis
    const upvote = client.emojis.find("name", "upvote");
    const downvote = client.emojis.find("name", "downvote");
  // React with said emojis
    message.react(upvote.id)
      .then( () => message.react(downvote.id) )
  // Catch any errors that may occur
      .catch((err) => {});
    return;
  }


  if(message.content.startsWith(config.prefix + "prefix")) {
    if(message.author.id !== config.ownerID) {
      message.channel.send("You don't have permission to use that command!");
      return;
    }
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    // change the configuration in memory
    config.prefix = newPrefix;
    message.channel.send("Prefix changed to: " + config.prefix);
    // Now we have to save the file.
    fs.writeFile("./data/config.json", JSON.stringify(config), (err) => console.error);
  }

  if(message.content.startsWith(config.prefix + "version")) {
    message.channel.send("Currently running ChaosBot " + version);
  }

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
