// Create and manage reaction-based self-assign roles
exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`No input was provided.`); return;}
  console.log("Still working 1");
  if (args[0].startsWith("new")) {
    if (args.length < 3) {message.channel.send(`Not enough arguments.`); return;};
    console.log("Still working 2");
    if (args[1] && args[1].startsWith("<#")) {
      var channel = message.guild.channels.get(client.regex.channel.exec(args[1])[1]);
      if (!channel) {message.channel.send("Channel not found."); return;}
      console.log("Still working 3");
      var newArgs = args.slice(2).join(" ").split(/ \| /g);
      if (newArgs.length < 2) {message.channel.send(`Not enough arguments.`); return;};
      console.log("Still working 4");
      if (newArgs[0].startsWith("<@&")) {
        var roles = client.getMatches(newArgs[0], client.regex.user, 1);
        var i;
        console.log("Still working 5");
        for (i = 0; i < roles.length; i++) {
          console.log(`Still working ${i}a`);
          let role = message.guild.roles.get(roles[i]);
          console.log(`Still working ${i}b`);
          if (!role) {message.channel.send(`One or more required roles are invalid.`); return};
        };
        console.log("Still working 6");
        newArgs = newArgs.slice(1);
      } else {var roles = [];};
      console.log("Still working 7");
      var header = newArgs[0];

      var assignList = newArgs[1].trim().split(/ +/g);

      var assigns = {};
      console.log("Still working 8");

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
      console.log("Still working 9");

      if (newArgs[2]) {
        var footer = newArgs[2];
      } else {var footer = ""};

      console.log("Still working 10");
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
        reactions.forEach(reactEmote => sentMsg.react(reactEmote));
        server.selfassigns[sentMsg.id] = {"header":header, "roles":roles,"assigns":assigns,"footer":footer};
        client.settings.set(message.guild.id, server);
      })
      return;
    } else {message.channel.send("No channel provided."); return;}
  }
}

