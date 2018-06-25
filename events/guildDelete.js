exports.run = (client, guild) => {
  client.settings.delete(guild.id);
}
