// Command to add and remove roles from authorization levels, and to manipulate the levels required to use commands
const ownerCommands = ["prefix", "auth"]

exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`A valid command or role was not specified.`); return};
  // If first argument is a role mention
  if (args[0].startsWith("<@&")) {
    let targetID = client.regex.user.exec(args[0])[1];
    let role = message.guild.roles.get(targetID);
    if (!role) {message.channel.send(`That isn't a valid role.`); return};
    if (args[1] >= 0 && args[1] <= 10) {
      server.perms[targetID] = args[1];
      message.channel.send(`Authorization level for '${role.name}' has been set to ${args[1]}.`);
    } else if (!args[1]) { message.channel.send(`Authorization level for '${role.name}' is currently: ${server.perms[targetID]}.`);
    } else message.channel.send(`Authorization level must be between 1 and 10.`);
  }
  // If first argument is the name of an owner-only command
  else if (ownerCommands.includes(args[0])) {message.channel.send(`That command can only be used by owners.`)}
  // If first argument is a valid command
  else if (client.settings.get("commandList").includes(`${args[0]}.js`)) {
    if (args[1] >= 0 && args[1] <= 10) {
      server.commands[args[0]] = args[1];
      message.channel.send(`Authorization level for '${args[0]}' has been set to ${args[1]}.`);
    } else if (!args[1]) { message.channel.send(`Authorization level for '${args[0]}' is currently: ${server.commands[args[0]]}.`);
    } else message.channel.send(`Authorization level must be between 1 and 10.`);
  }
  client.settings.set(message.guild.id, server);
  return;
}
