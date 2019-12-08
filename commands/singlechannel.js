// Command to toggle current channel as a single-message channel
exports.run = (client, server, message, args) => {

  // Find the index of the current channel
  var index = server.singlechannels.indexOf(message.channel.id);
  // If found, remove from array
  if (index > -1) {
    server.singlechannels.splice(index, 1);
    message.channel.send(`<#${message.channel.id}> removed from single-message channels list.`);
  } else {
  // If not found, add to array
    server.singlechannels.push(message.channel.id);
    message.channel.send(`<#${message.channel.id}> added to single-message channels list.`);
  }
  // Save the server config to database
  client.settings.set(message.guild.id, server);
  return;
}
