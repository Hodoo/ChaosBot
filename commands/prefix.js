// Command to change server prefix
exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`No prefix was provided.`); return;}
  // Gets the prefix from the command
  let newPrefix = args[0];
  // Change the server configuration in memory
  server.prefix = newPrefix;
  message.channel.send(`Prefix changed to: ${server.prefix}`);
  // Save the changes to database
  client.settings.set(message.guild.id, server);
  return;
}
