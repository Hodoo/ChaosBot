// Temporary command to dump lists of reactions to a specified message
exports.run = (client, server, message, args) => {
  if (args[0] && args[0].startsWith("<#")) {
    var channel = message.guild.channels.get(client.regex.channel.exec(args[0])[1]);
    if (!channel) {message.channel.send("Channel not found."); return;}
  } else {message.channel.send("No channel provided."); return;}
  if (!args[1]) {message.channel.send(`No message id provided.`); return;};
  var newmsg = ""
  var emojis = [];
  var reactors = [];

  async function listUsers() {
    await channel.fetchMessage(args[1])
    .then(async m => {
      var reactions = Array.from(m.reactions.keys());
      for (x in reactions) {
        var reaction = m.reactions.get(reactions[x]);
        emojis.push(reaction.emoji.name);
        reactors[x] = [];
        await reaction.fetchUsers()
        .then(users => {
          users.tap(user => {
            let member = message.guild.member(user);
            reactors[x].push(member.displayName)
          })
        })
        newmsg = `**Reactions for ${emojis[x]}**\n`
        reactors[x].forEach(user => newmsg += `${user}\n`);
        message.channel.send(newmsg);
      }
    })
  }

  listUsers()
}
