// Command to manipulate role announcements
exports.run = (client, server, message, args) => {
  if (!args[0]) return;
  // If message starts with a channel mention, add or remove that channel from greetchannels
  if (args[0].startsWith("<#")) {
    let target = client.regex.channel.exec(args[0])[1];
    // Find the index of the target channel
    var index = server.rolechannels.indexOf(target);
    // If found, remove from array
    if (index > -1) {
      server.rolechannels.splice(index, 1);
      message.channel.send(`<#${target}> removed from role announcement channels.`);
    } else {
    // If not found, add to array
      server.rolechannels.push(target);
      message.channel.send(`<#${target}> added to role announcement channels.`);
    }
  }
  else if (args[0] === "add") {
    if (args[1].startsWith("<@&")) {
      let targetID = client.regex.user.exec(args[1])[1];
      let role = message.guild.roles.get(targetID);
      if (!role) {message.channel.send(`That isn't a valid role.`); return};

      if (!(args[2] === "gain" || args[2] === "loss")) {
        message.channel.send(`The valid options of 'gain' or 'loss' were not provided as the third argument.'`);
        return
      } else {
        var targetMessages = args[2] + 'Messages'
      }

      let msg = args.slice(3).join(" ");
      if (!msg) {message.channel.send(`No message was provided.`); return;};

      server[targetMessages][targetID] = msg;
      message.channel.send(`Added ${args[2]} announcement for ${role.name}:\n${msg}`);
    } else {message.channel.send(`No role was provided.`); return};
  }
  else if (args[0].startsWith("list")) {
    if (!(args[1] === "gain" || args[1] === "loss")) {
      message.channel.send(`The valid options of 'gain' or 'loss' were not provided.'`);
      return;
    } else {
      var targetMessages = args[1] + 'Messages'
    }
    if (Object.keys(server[targetMessages]).length > 0) {
      let list = "";
      Object.keys(server[targetMessages]).forEach(function(content, index) {
        list += `[${index}]: <@&${content}>: ${server[targetMessages][content]}\n`;
      });
      message.channel.send(`Current role ${args[1]} announcements:\n${list}`);
    } else {message.channel.send(`There are currently no role ${args[1]} announcements.`); return;}
    return;
  }
  else if (args[0] === "remove") {
    if (!(args[1] === "gain" || args[1] === "loss")) {
      message.channel.send(`The valid options of 'gain' or 'loss' were not provided.'`);
      return
    } else {
      var targetMessages = args[1] + 'Messages'
    }
    if (Object.keys(server[targetMessages]).length > args[2] && args[2] > -1) {
      delete server[targetMessages][Object.keys(server[targetMessages])[args[2]]]
      message.channel.send(`[${args[2]}] was removed from role ${args[1]} announcements.`);
    } else {message.channel.send(`"${args[2]}" is not a valid selection.`); return;}
  }

  client.settings.set(message.guild.id, server);
  return;
}
