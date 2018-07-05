// Command to manipulate goodbye message
exports.run = (client, server, message, args) => {
  if (!args[0]) return;
  // If message starts with a channel mention, add or remove that channel from leavechannels
  if (args[0].startsWith("<#")) {
    let target = client.regex.channel.exec(args[0])[1];
    // Find the index of the target channel
    var index = server.leavechannels.indexOf(target);
    // If found, remove from array
    if (index > -1) {
      server.leavechannels.splice(index, 1);
      message.channel.send(`<#${target}> removed from goodbye channels.`);
    } else {
    // If not found, add to array
      server.leavechannels.push(target);
      message.channel.send(`<#${target}> added to goodbye channels.`);
    }
  }
  else if (args[0].startsWith("list")) {
    if (server.leavemessages.length > 0) {
      let list = "";
      server.leavemessages.forEach(function(content, index) {
        list += `[${index}]: ${content}\n`;
      });
      message.channel.send(`Current goodbye messages:\n${list}`);
    } else {message.channel.send(`There are currently no goodbye messages.`); return;}
    return;
  }
  else if (args[0] === "remove") {
    if (server.leavemessages.length > args[1] && args[1] > -1) {
      server.leavemessages.splice(args[1], 1);
      message.channel.send(`[${args[1]}] was removed from goodbye messages.`);
    } else {message.channel.send(`"${args[1]}" is not a valid selection.`); return;}
  }
  else if (args[0] === "add") {
    let msg = args.slice(1).join(" ");
    if (!msg) {message.channel.send(`No goodbye message was provided.`); return;};
    server.leavemessages.push(msg);
    message.channel.send(`Added goodbye message:\n${msg}`);
  }
  client.settings.set(message.guild.id, server);
  return;
}
