// Command to manipulate welcome message
exports.run = (client, server, message, args) => {
  if (!args[0]) return;
  // If message starts with a channel mention, add or remove that channel from greetchannels
  if (args[0].startsWith("<#")) {
    let target = client.regex.channel.exec(args[0])[1];
    // Find the index of the target channel
    var index = server.greetchannels.indexOf(target);
    // If found, remove from array
    if (index > -1) {
      server.greetchannels.splice(index, 1);
      message.channel.send(`<#${target}> removed from greeting channels.`);
    } else {
    // If not found, add to array
      server.greetchannels.push(target);
      message.channel.send(`<#${target}> added to greeting channels.`);
    }
  }
  else if (args[0].startsWith("list")) {
    if (server.greetmessages.length > 0) {
      let list = "";
      server.greetmessages.forEach(function(content, index) {
        list += `[${index}]: ${content}\n`;
      });
      message.channel.send(`Current welcome messages:\n${list}`);
    } else {message.channel.send(`There are currently no welcome messages.`); return;}
    return;
  }
  else if (args[0] === "remove") {
    if (server.greetmessages.length > args[1] && args[1] > -1) {
      server.greetmessages.splice(args[1], 1);
      message.channel.send(`[${args[1]}] was removed from welcome messages.`);
    } else {message.channel.send(`"${args[1]}" is not a valid selection.`); return;}
  }
  else if (args[0] === "add") {
    let msg = args.slice(1).join(" ");
    if (!msg) {message.channel.send(`No welcome message was provided.`); return;};
    server.greetmessages.push(msg);
    message.channel.send(`Added welcome message:\n${msg}`);
  }
  client.settings.set(message.guild.id, server);
  return;
}
