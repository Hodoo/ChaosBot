// Create and manage reaction-based self-assign roles
exports.run = (client, server, message, args) => {
  const Discord = require('discord.js');
  if (!args[0]) {message.channel.send(`No input was provided.`); return;}
  if (args[0].startsWith("new")) {
    if (args.length < 3) {message.channel.send(`Not enough arguments.`); return;};
    if (args[1] && args[1].startsWith("<#")) {
      var channel = message.guild.channels.get(client.regex.channel.exec(args[1])[1]);
      if (!channel) {message.channel.send("Channel not found."); return;}
      var newArgs = args.slice(2).join(" ").split(/ \| /g);
      if (newArgs.length < 2) {message.channel.send(`Not enough arguments.`); return;};
      if (newArgs[0].startsWith("<@&")) {
        var roles = client.getMatches(newArgs[0], client.regex.users, 1);
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

      var newmsg = "\n";
      for (const property in assigns) {
        let emote = client.emojis.get(property);
        let role = message.guild.roles.get(assigns[property]);
        reactions.push(property);
        newmsg += `${emote} - ${role}\n`;
      }
      newmsg += "\n"+footer;

      var embed = new Discord.RichEmbed()
        .setColor("#f712ff")
        .setTitle(header)
        .setDescription(newmsg)

      channel.send(embed).then(sentMsg => {
        reactions.forEach(reactEmote => sentMsg.react(reactEmote));
        server.selfassigns[sentMsg.id] = {"channel":channel.id, "header":header, "roles":roles,"assigns":assigns,"footer":footer};
        client.settings.set(message.guild.id, server);
        console.log(Object.keys(sentMsg.reactions).toString())
      })
      return;
    } else {message.channel.send("No channel provided."); return;}
  }
  if (args[0].startsWith("delete")) {
    if (!args[1]) {message.channel.send(`No message id provided.`); return;};
    if (Object.keys(server.selfassigns).includes(args[1])) {
      var channel = message.guild.channels.get(server.selfassigns[args[1]]["channel"]);
      if (channel) {
        channel.fetchMessage(args[1])
          .then(m => m.delete())
          .catch(console.error);
        message.channel.send(`Self-assign message deleted.`)
      } else {message.channel.send(`Unfound self-assign entry ${args[1]} removed from database.`)}
      delete server.selfassigns[args[1]];
      client.settings.set(message.guild.id, server);
    } else {message.channel.send(`Message id not found in database.`); return;};
  }
  if (args[0].startsWith("edit")) {
    var emoteAdded = false;
    var emoteRemoved = false;
    if (!args[1]) {message.channel.send(`No message id provided.`); return;};
    if (Object.keys(server.selfassigns).includes(args[1])) {
      var channel = message.guild.channels.get(server.selfassigns[args[1]]["channel"]);
      if (channel) {
        channel.fetchMessage(args[1])
          .then(m => {
            if (args[2] == "header" || args[2] == "footer") {
              if (args.length < 4) {message.channel.send(`Not enough arguments.`); return;};
              server.selfassigns[args[1]][args[2]] = args.slice(2).join(" ")
            }
            else if (args[2] == "add") {
              if (args[3].startsWith("<@&")) {
                var roles = client.getMatches(args[3], client.regex.users, 1);
                let role = message.guild.roles.get(roles[0]);
                if (!role) {message.channel.send(`Role is invalid.`); return};
                server.selfassigns[args[1]]["roles"].push(roles[0]);
              } else {
                let emoteID = client.regex.emojisingle.exec(args[3])[1];
                let emote = client.emojis.get(emoteID);
                var newEmote = emoteID;
                emoteAdded = true;
                if (!emote) {message.channel.send(`Emote is invalid or inaccessible.`); return};
                let roleID = client.regex.user.exec(args[4])[1];
                let role = message.guild.roles.get(roleID);
                if (!role) {message.channel.send(`Role is invalid.`); return};
                server.selfassigns[args[1]]["assigns"][emoteID] = roleID;
              };
            }
            else if (args[2] == "remove") {
              if (args[3].startsWith("<@&")) {
                let roleID = client.regex.user.exec(args[3])[1];
                let index = server.selfassigns[args[1]]["roles"].indexOf(roleID);
                if (index > -1) {
                  server.selfassigns[args[1]]["roles"].splice(index, 1);
                } else {message.channel.send(`Role wasn't required.`); return};
              } else {
                let emoteID = client.regex.emojisingle.exec(args[3])[1];
                if (Object.keys(server.selfassigns[args[1]]["assigns"]).includes(emoteID)) {
                  delete server.selfassigns[args[1]]["assigns"][emoteID]
                  var remEmote = client.emojis.get(emoteID).identifier;
                  emoteRemoved = true;
                } else {message.channel.send(`Emote wasn't included.`); return};
              }
            } else {message.channel.send(`Must be 'header', 'footer', 'add', or 'remove'.`); return};

            var newmsg = "\n";
            for (const property in server.selfassigns[args[1]]["assigns"]) {
              let emote = client.emojis.get(property);
              let role = message.guild.roles.get(server.selfassigns[args[1]]["assigns"][property]);
              newmsg += `${emote} - ${role}\n`;
            }
            newmsg += "\n"+server.selfassigns[args[1]]["footer"];

            var embed = new Discord.RichEmbed()
              .setColor("#f712ff")
              .setTitle(server.selfassigns[args[1]]["header"])
              .setDescription(newmsg)

            m.edit(embed);
            if (emoteAdded == true) {m.react(newEmote)};
            if (emoteRemoved == true) {
              var reaction = m.reactions.get(remEmote)
              try {
                for (const user of reaction.users.values()) {
                  await reaction.remove(user);
                }
              } catch (error) {
                console.error('Failed to remove reactions.');
              }
            };
            message.channel.send(`Self-assign message edited.`)
            client.settings.set(message.guild.id, server);
          })
          .catch(console.error);
      } else {message.channel.send(`Couldn't find self-assign entry ${args[1]}.`)}
    } else {message.channel.send(`Message id not found in database.`); return;};
  }
}
