exports.run = (client, messageReaction, user, state) => {

  // Ignore DMs
  if (messageReaction.message.channel.type !=='text') return;

  // Get information from enmap
  let server = client.settings.get(messageReaction.message.guild.id);

  if (!Object.keys(server.selfassigns).includes(messageReaction.message.id)) return;
  if (!Object.keys(server.selfassigns[messageReaction.message.id]["assigns"]).includes(messageReaction.emoji.id)) return;

  let member = messageReaction.message.guild.member(user);

  if (state == "Add") {
    if (member.roles.has(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id])) return;
    member.addRole(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id]);
  };

  if (state == "Remove") {
    if (member.roles.has(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id])) {
      member.removeRole(server.selfassigns[messageReaction.message.id]["assigns"][messageReaction.emoji.id]);
    }
  };
}
