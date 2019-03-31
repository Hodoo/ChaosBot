// Command to set up automated removal of roles
exports.run = (client, server, message, args) => {
  if (!args[0]) return;
  else if (args[0].startsWith("list")) {
    if (server.roletimers.length > 0) {
      let list = "";
      server.roletimers.forEach(function(content, index) {
        let time = new Date(content[0]);
        let string = `[${index}]: <@&${content[1]}> @ ${time.getUTCHours()}:${time.getUTCMinutes()} UTC`
        if (content[2] && content[3]) {string += `, <#${content[2]}>: "${content[3]}"`};
        list += `${string}\n`;
      });
      message.channel.send(`Current role timers:\n${list}`);
    } else {message.channel.send(`There are currently no role timers.`); return;}
    return;
  }
  else if (args[0] === "remove") {
    if (server.roletimers.length > args[1] && args[1] > -1) {
      server.roletimers.splice(args[1], 1);
      message.channel.send(`[${args[1]}] was removed from role timers.`);
    } else {message.channel.send(`"${args[1]}" is not a valid selection.`); return;}
  }
  else if (args[0] === "add") {
    if (args[1] && args[1].startsWith("<@&")) {
      var targetID = client.regex.user.exec(args[1])[1];
      let role = message.guild.roles.get(targetID);
      if (!role) {message.channel.send(`That isn't a valid role.`); return};
    } else {message.channel.send(`No role was provided.`); return};

    if (!args[2]) {message.channel.send(`No time was provided.`); return};
    time = args[2].split(':');
    if (!time[2] && 0 <= time[0] && time[0] <= 23 && 0 <= time[1] && time[1] <= 59) {
      let today = new Date();
      let target = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), time[0], time[1], 0));
      var targetStamp = target.getTime();
    } else {message.channel.send(`Input time must be in 24h format: hh:mm`); return;}

    if (args[3]) {
      if (args[3].startsWith("<#")) {
        var targetChannel = client.regex.channel.exec(args[3])[1];
        if (args[4]) {
          var msg = args.slice(4).join(" ");
          server.roletimers.push([targetStamp, targetID, targetChannel, msg]);
        } else {message.channel.send(`No message was provided.`); return;};
      } else {message.channel.send(`"${args[3]}" is not a valid channel.`); return;}
    } else {
      server.roletimers.push([targetStamp, targetID]);
    }

    message.channel.send(`Added timer to remove the ${args[1]} role at ${args[2]} UTC daily.`);

  }
  client.settings.set(message.guild.id, server);
  return;
}
