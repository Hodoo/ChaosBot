// Command to toggle current channel as a voting channel
exports.run = (client, server, message, args) => {
  // Don't allow the same channel in both categories
  if (server.suggestchannels.includes(message.channel.id)) {
    message.channel.send(`<#${message.channel.id}> is already a suggestion channel!`);
    return;
  }
  // Find the index of the current channel
  var index = server.votingchannels.indexOf(message.channel.id);
  // If found, remove from array
  if (index > -1) {
    server.votingchannels.splice(index, 1);
    message.channel.send(`<#${message.channel.id}> removed from voting channels list.`);
  } else {
  // If not found, add to array
    server.votingchannels.push(message.channel.id);
    message.channel.send(`<#${message.channel.id}> added to voting channels list.`);
  }
  // Save the server config to database
  client.settings.set(message.guild.id, server);
  return;
}
