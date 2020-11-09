// Command to toggle certain server-wide settings
const toggleSettings = ["amazonFilter"]

exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`A valid setting was not specified.`); return};
  if (!toggleSettings.includes(args[0])) {message.channel.send(`"${args[0]}" is not a valid toggle setting.`); return};
  // Toggle the current state of the setting
  server[args[0]] = !server[args[0]];
  message.channel.send(`${args[0]} is now ${server[args[0]] ? "enabled" : "disabled"}.`);
  // Save the server config to database
  client.settings.set(message.guild.id, server);
  return;
}
