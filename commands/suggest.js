// Command to toggle current channel as a suggestion channel
exports.run = (client, server, message, args) => {
  // Don't allow the same channel in both categories
  if (server.votingchannels.includes(message.channel.id)) {
    message.channel.send(`<#${message.channel.id}> is already a voting channel!`);
    return;
  }
  // Find the index of the current channel
  var index = server.suggestchannels.indexOf(message.channel.id);
  // If found, remove from array
  if (index > -1) {
    server.suggestchannels.splice(index, 1);
    message.channel.send(`<#${message.channel.id}> removed from suggestion channels list.`);
  } else {
  // If not found, add to array
    server.suggestchannels.push(message.channel.id);
    message.channel.send(`<#${message.channel.id}> added to suggestion channels list.`);
  }
  // Save the server config to database
  client.settings.set(message.guild.id, server);
  return;
}
