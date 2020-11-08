// Temporary command to dump lists of reactions to a specified message
exports.run = (client, server, message, args) => {
  const fs = require('fs');

  if (args[0] && args[0].startsWith("<#")) {
    var channel = message.guild.channels.cache.get(client.regex.channel.exec(args[0])[1]);
    if (!channel) {message.channel.send("Channel not found."); return;}
  } else {message.channel.send("No channel provided."); return;}
  if (!args[1]) {message.channel.send(`No message id provided.`); return;};

  // Find the index of the target message
  var index = server.reactTrackers.indexOf(args[1]);
  // If found, remove from array
  if (index > -1) {
    server.reactTrackers.splice(index, 1);
    client.settings.set(message.guild.id, server);
    fs.unlinkSync(`./data/web/${message.guild.id}/${args[1]}.txt`)
    message.channel.send(`${args[1]} removed from reaction tracking.`);
    return;
  }

  var output = "";
  var emojis = [];
  var reactors = [];

  async function listUsers() {
    await channel.messages.fetch(args[1])
    .then(async m => {
      var reactions = Array.from(m.reactions.cache.keys());
      for (x in reactions) {
        var reaction = m.reactions.cache.get(reactions[x]);
        emojis.push(reaction.emoji.name);
        reactors[x] = [];
        await reaction.users.fetch()
        .then(users => {
          users.each(user => {
            let member = message.guild.member(user);
            if (!member) {return};
            reactors[x].push(member.displayName)
          })
        })
        reactors[x].sort();
        output += `${emojis[x]}`
        reactors[x].forEach(user => output += `,${user}`);
        output += `\n`
      }
      fs.promises.mkdir(`./data/web/${message.guild.id}`, {recursive: true})
      .then(x => fs.promises.writeFile(`./data/web/${message.guild.id}/${args[1]}.txt`, output));
      server.reactTrackers.push(args[1]);
      client.settings.set(message.guild.id, server);
      message.channel.send(`Reactions can be accessed at http://${client.settings.get("address")}/${message.guild.id}/${args[1]}.txt`);
    })
  }

  listUsers()
}
