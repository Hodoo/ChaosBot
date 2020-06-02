// Create and manage reaction-based self-assign roles
exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`No input was provided.`); return;}
  if (args[0].startsWith("new")) {
    if (args.length < 3) {message.channel.send(`Not enough arguments.`); return;};
    if (args[1] && args[1].startsWith("<#")) {
      var channel = message.guild.channels.get(client.regex.channel.exec(args[1])[1]);
      if (!channel) {message.channel.send("Channel not found."); return;}
      var newArgs = args.slice(2).join(" ").split(/ \| /g);
      if (newArgs.length < 2) {message.channel.send(`Not enough arguments.`); return;};
      if (newArgs[0].startsWith("<@&")) {
        var roles = client.getMatches(newArgs[0], client.regex.user, 1);
        var i;
        for (i = 0; i < roles.length; i++) {
          let role = message.guild.roles.get(roles[i]);
          if (!role) {message.channel.send(`One or more required roles are invalid.`); return};
        };
        newArgs = newArgs.slice(1);
      } else {var roles = [];};

      var header = newArgs[0];

      var assignList = newArgs[1].trim().split(/ +/g);

      var assigns = {};

      for (i = 0; i < assignList.length; i += 2) {
        if (!assignList[i+1]) {message.channel.send(`Unmatched emote.`); return};
        let emoteID = client.regex.emojisingle.exec(assignList[i])[1];
        let emote = client.emojis.get(emoteID);
        if (!emote) {message.channel.send(`One or more assign emotes are invalid or inaccessible.`); return};
        let roleID = client.regex.user.exec(assignList[i+1])[1];
        let role = message.guild.roles.get(roleID);
        if (!role) {message.channel.send(`One or more assign roles are invalid.`); return};
        assigns[emoteID] = roleID;
      };

      if (newArgs[2]) {
        var footer = newArgs[2];
      } else {var footer = ""};

      var reactions = [];

      var newmsg = header +"\n\n";
      for (const property in assigns) {
        let emote = client.emojis.get(property);
        let role = message.guild.roles.get(assigns[property]);
        reactions.push(property);
        newmsg += `${emote} - ${role}\n`;
      }
      newmsg += "\n"+footer;
      channel.send(newmsg).then(sentMsg => {
        sentMsg.react("👍")
      })
    } else {message.channel.send("No channel provided."); return;}
  }
}

