exports.run = (client, guild) => {
  console.log(`${Date.now()}: LEFT: ${guild.name} (${guild.id})`);
  client.settings.delete(guild.id);
}
