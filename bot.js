// init project
var express = require('express');
var app = express();
const Discord = require("discord.js");
const config = require("./data/config.json");
const serverdefault = require("./data/server-default.json");
const client = new Discord.Client();
require("./functions/functions.js")(client);
var pkginfo = require('pkginfo')(module, 'version');
client.version = module.exports.version

// Set up Enmap and assign to the client
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
Object.assign(client, Enmap.multi(["settings"], EnmapLevel, { dataDir: './data' }));

// List of valid protected commands
var commandsList = ["prefix","suggest","voting","say","welcome","goodbye"]
// List of safe commands
var safeList = ["version"]
// List of protected commands
var protectedList = ["auth"]


// Listen for requests, to allow monitoring for downtime
var listener = app.listen(config.port, function () {
  console.log("Listening on port " + listener.address().port);
});
// Print received pings to console and respond with OK status
app.get("/", (request, response) => {
//  console.log(`${Date.now()}: Ping Received`);
  response.sendStatus(200);
});


// Bot start
client.on("ready", () => {
  client.user.setActivity('your votes', { type: 'WATCHING' });
  console.log(`ChaosBot version: ${version}`);
  console.log("ChaosBot is running");
});

client.on("guildCreate", (guild) => {
  console.log(Date.now() + ": JOINED: " + guild.name + " (" + guild.id + ")");
  let server = serverdefault;
  server.ownerID = guild.ownerID;
  client.settings.set(guild.id, server);
});

client.on("guildDelete", guild => {
  client.settings.delete(guild.id);
});

client.on('guildMemberAdd', member => {
  let server = client.settings.get(member.guild.id);
  if (server.greetchannels.length && server.greetmessages.length) {
    var i
    let channels = server.greetchannels;
    let randmsg = server.greetmessages[Math.floor(Math.random() * server.greetmessages.length)];
    let message = replaceVars(member, randmsg);
    for (i in channels) {
      member.guild.channels.find('id', channels[i]).send(message);
    }
  }
  return;
});

client.on('guildMemberRemove', member => {
  let server = client.settings.get(member.guild.id);
  if (server.leavechannels.length && server.leavemessages.length) {
    var i
    let channels = server.leavechannels;
    let randmsg = server.leavemessages[Math.floor(Math.random() * server.leavemessages.length)];
    let message = replaceVars(member, randmsg);
    for (i in channels) {
      member.guild.channels.find('id', channels[i]).send(message);
    }
  }
  return;
});

client.on("message", (message) => {

/*
  console.log(message.content);
*/

  // Get information from enmap
  let server = client.settings.get(message.guild.id);

  // Ignore messages from bots
  if (message.author.bot) return;

  // Command to change server prefix
  if(message.content.startsWith(server.prefix + "prefix")) {
    let cmd = "prefix";
    if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    // change the server configuration in memory
    server.prefix = newPrefix;
    message.channel.send(`Prefix changed to: ${server.prefix}`).catch(logSendError);
    // Save the changes to database
    client.settings.set(message.guild.id, server);
    return;
  }

  // Make the bot say whatever you want, wherever you want
  if(message.content.startsWith(server.prefix + "say")) {
    let cmd = "say";
    if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    if (message.content.length <= server.prefix.length + cmd.length)  {message.channel.send(`No message was provided.`).catch(logSendError); return;};
    // If message starts with a channel mention, try to send message there
    if (message.content.split(" ", 2)[1].startsWith("<#")) {
      let channel = message.guild.channels.find('id', chanPattern.exec(message.content.split(" ", 2)[1])[1]);
      if (!channel) {
        message.channel.send("Channel not found.").catch(logSendError);
        return;
      }
      let newmsg = message.content.slice(server.prefix.length + 26);
      if (newmsg === "") {message.channel.send(`No message was provided.`).catch(logSendError); return;};
      channel.send(newmsg).catch(logSendError);
    }
    // Otherwise, send message in current channel
    else {
      let newmsg = message.content.slice(server.prefix.length + 4);
      if (newmsg === "") {message.channel.send(`No message was provided.`).catch(logSendError); return;};
      message.channel.send(newmsg).catch(logSendError);
    }
    return;
  }

  // Command to return current version number
  if(message.content.startsWith(server.prefix + "version")) {
    let cmd = "version";
    message.channel.send(`Currently running ChaosBot v${version}`).catch(logSendError);
    return;
  }

  // Command to toggle mentioned user or command as authorized
  if(message.content.startsWith(server.prefix + "auth")) {
    let cmd = "auth";
    if(!(message.author.id == server.ownerID)) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    let arg = message.content.split(" ", 2)[1];
    // If message starts with a user mention, add or remove that user from authUsers
    if (arg.startsWith("<@")) {
      let target = userPattern.exec(arg)[1];
      // Find the index of the target user
      var index = server.authUsers.indexOf(target);
      // If found, remove from array
      if (index > -1) {
        server.authUsers.splice(index, 1);
        message.channel.send(`<@${target}> removed from authorized users.`).catch(logSendError);
      } else {
      // If not found, add to array
        server.authUsers.push(target);
        message.channel.send(`<@${target}> added to authorized users.`).catch(logSendError);
      }
    } else if (commandsList.includes(arg)) {
        // Find the index of the target user
        var index = server.authcommands.indexOf(arg);
        // If found, remove from array
        if (index > -1) {
          server.authcommands.splice(index, 1);
          message.channel.send(`${server.prefix}${arg} removed from authorized commands.`).catch(logSendError);
        } else {
          // If not found, add to array
          server.authcommands.push(arg);
          message.channel.send(`${server.prefix}${arg} added to authorized commands.`).catch(logSendError);
        }
    }
    else if (safeList.includes(arg)) {message.channel.send(`There's no reason to protect that command.`).catch(logSendError)}
    else if (protectedList.includes(arg)) {message.channel.send(`That command should not be authorized.`).catch(logSendError)}
    else {message.channel.send(`"${server.prefix}${arg}" isn't a valid command.`).catch(logSendError)}
    client.settings.set(message.guild.id, server);
    return;
  }

  // Command to manipulate welcome message
  if(message.content.startsWith(server.prefix + "welcome")) {
    let cmd = "welcome";
    if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
      message.channel.send("You don't have permission to use that command!").catch(logSendError);
      return;
    }
    let args = message.content.split(" ", 3);
    // If message starts with a channel mention, add or remove that channel from greetchannels
    if (args[1].startsWith("<#")) {
      let target = chanPattern.exec(args[1])[1];
      // Find the index of the target channel
      var index = server.greetchannels.indexOf(target);
      // If found, remove from array
      if (index > -1) {
        server.greetchannels.splice(index, 1);
        message.channel.send(`<#${target}> removed from greeting channels.`).catch(logSendError);
      } else {
      // If not found, add to array
        server.greetchannels.push(target);
        message.channel.send(`<#${target}> added to greeting channels.`).catch(logSendError);
      }
    }
    else if (args[1].startsWith("list")) {
      if (server.greetmessages.length > 0) {
        let list = "";
        server.greetmessages.forEach(function(content, index) {
          list += `[${index}]: ${content}\n`;
        });
        message.channel.send(`Current welcome messages:\n${list}`).catch(logSendError);
      } else {message.channel.send(`There are currently no welcome messages.`).catch(logSendError); return;}
      return;
    }
    else if (args[1] === "remove") {
      if (server.greetmessages.length > args[2] && args[2] > -1) {
        server.greetmessages.splice(args[2], 1);
        message.channel.send(`[${args[2]}] was removed from welcome messages.`).catch(logSendError);
      } else {message.channel.send(`"${args[2]}" is not a valid selection.`).catch(logSendError); return;}
    }
    else if (args[1] === "add") {
      let msg = message.content.slice(server.prefix.length + 12);
      if (msg === "") {message.channel.send(`No welcome message was provided.`).catch(logSendError); return;};
      server.greetmessages.push(msg);
      message.channel.send(`Added welcome message:\n${msg}`).catch(logSendError);
    }
    client.settings.set(message.guild.id, server);
    return;
    }

    // Command to manipulate goodbye message
    if(message.content.startsWith(server.prefix + "goodbye")) {
      let cmd = "goodbye";
      if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
        message.channel.send("You don't have permission to use that command!").catch(logSendError);
        return;
      }
      let args = message.content.split(" ", 3);
      // If message starts with a channel mention, add or remove that channel from leavechannels
      if (args[1].startsWith("<#")) {
        let target = chanPattern.exec(args[1])[1];
        // Find the index of the target channel
        var index = server.leavechannels.indexOf(target);
        // If found, remove from array
        if (index > -1) {
          server.leavechannels.splice(index, 1);
          message.channel.send(`<#${target}> removed from goodbye channels.`).catch(logSendError);
        } else {
        // If not found, add to array
          server.leavechannels.push(target);
          message.channel.send(`<#${target}> added to goodbye channels.`).catch(logSendError);
        }
      }
      else if (args[1].startsWith("list")) {
        if (server.leavemessages.length > 0) {
          let list = "";
          server.leavemessages.forEach(function(content, index) {
            list += `[${index}]: ${content}\n`;
          });
          message.channel.send(`Current goodbye messages:\n${list}`).catch(logSendError);
        } else {message.channel.send(`There are currently no goodbye messages.`).catch(logSendError); return;}
        return;
      }
      else if (args[1] === "remove") {
        if (server.leavemessages.length > args[2] && args[2] > -1) {
          server.leavemessages.splice(args[2], 1);
          message.channel.send(`[${args[2]}] was removed from goodbye messages.`).catch(logSendError);
        } else {message.channel.send(`"${args[2]}" is not a valid selection.`).catch(logSendError); return;}
      }
      else if (args[1] === "add") {
        let msg = message.content.slice(server.prefix.length + 12);
        if (msg === "") {message.channel.send(`No goodbye message was provided.`).catch(logSendError); return;};
        server.leavemessages.push(msg);
        message.channel.send(`Added goodbye message:\n${msg}`).catch(logSendError);
      }
      client.settings.set(message.guild.id, server);
      return;
      }

  // Command to toggle current channel as a suggestion channel
  if(message.content.startsWith(server.prefix + "suggest")) {
    let cmd = "suggest";
    if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
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
    // Save the server config to database
    client.settings.set(message.guild.id, server);
    return;
  }

  // Command to toggle current channel as a voting channel
  if(message.content.startsWith(server.prefix + "voting")) {
    let cmd = "voting";
    if(!(message.author.id == server.ownerID || server.authUsers.includes(message.author.id) && server.authcommands.includes(cmd))) {
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
    // Save the server config to database
    client.settings.set(message.guild.id, server);
    return;
  }



  /*
  Make sure to keep the following sections at the end, to prevent processing emojis on commands
  */

  // Check if posted in a voting channel
  if (server.votingchannels.includes(message.channel.id)) {
  // Extract custom emojis from message if present
    var matchedemojis = getMatches(message.content, emojiPattern, 1);
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



client.login(config.token);
