// Create and manage reaction-based self-assign roles
exports.run = (client, server, message, args) => {
  const Discord = require('discord.js');
  async function findMessage(guild, id) {
    let channels = guild.channels.filter(c => c.type == 'text').array();
    for (let current of channels) {
      let target = await current.fetchMessage(id);
      if (target) return target;
    }
  }
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
        server.selfassigns[sentMsg.id] = {"header":header, "roles":roles,"assigns":assigns,"footer":footer};
        client.settings.set(message.guild.id, server);
      })
      return;
    } else {message.channel.send("No channel provided."); return;}
  }
  if (args[0].startsWith("delete")) {
    if (!args[1]) {message.channel.send(`No message id provided.`); return;};
    if (Object.keys(server.selfassigns).includes(args[1])) {
      delete server.selfassigns[args[1]];
      client.settings.set(message.guild.id, server);
      findMessage(message.guild, args[1]).then(m => {
        if (m) {
          m.delete();
          message.channel.send(`Self-assign message ${args[1]} deleted and removed from database.`);
        } else {message.channel.send(`Self-assign associated with ${args[1]} removed from database.`); return;}
      })
    } else {message.channel.send(`Message id not found in database.`); return;};
  }
}
