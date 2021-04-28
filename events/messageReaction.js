exports.run = (client, messageReaction, user, state) => {
  const fs = require('fs');

  async function reactionHandler() {
    // Fetch full reaction if partial
    if (messageReaction.partial) {
      messageReaction = await messageReaction.fetch();
    };
    // Ignore DMs
    if (messageReaction.message.channel.type !=='text') return;
    // Ignore Bots
    if (user.bot) return;

    // Get information from enmap
    let server = client.settings.get(messageReaction.message.guild.id);

    if (Object.keys(server.selfassigns).includes(messageReaction.message.id)) {
      if (!Object.keys(server.selfassigns[messageReaction.message.id]["assigns"]).includes(messageReaction.emoji.id)) return;

      let member = messageReaction.message.guild.member(user);
      let reqroles = server.selfassigns[messageReaction.message.id]["roles"];
      let allowed = 0;

      if (reqroles.length > 0) {
        reqroles.forEach(element => {
          if (member.roles.cache.has(element)) {allowed = 1}});
      } else {allowed = 1};


      if (state == "Add") {
        if (allowed == 1) {
          if (member.roles.cache.has(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id])) return;
          member.roles.add(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id]);
        } else {
          messageReaction.users.remove(user);
        }
      };

      if (state == "Remove") {
        if (allowed == 1) {
          if (member.roles.cache.has(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id])) {
            member.roles.remove(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id]);
          }
        }
      };
    } else if (server.reactTrackers.includes(messageReaction.message.id)) {
      var output = "";
      var emojis = [];
      var reactors = [];

      await messageReaction.message.channel.messages.fetch(messageReaction.message.id)
      .then(async m => {
        var reactions = Array.from(m.reactions.cache.keys());
        for (x in reactions) {
          var reaction = m.reactions.cache.get(reactions[x]);
          emojis.push(reaction.emoji.name);
          reactors[x] = [];
          await reaction.users.fetch()
          .then(users => {
            users.each(user => {
              let member = messageReaction.message.guild.member(user);
              if (!member) {return};
              reactors[x].push(member.displayName)
            })
          })
          reactors[x].sort();
          output += `${emojis[x]}`
          reactors[x].forEach(user => output += `,${user}`);
          output += `\n`
        }
        fs.promises.mkdir(`./data/web/${messageReaction.message.guild.id}`, {recursive: true})
        .then(x => fs.promises.writeFile(`./data/web/${messageReaction.message.guild.id}/${messageReaction.message.id}.txt`, output));
      })
    }
  };
  reactionHandler();

}
