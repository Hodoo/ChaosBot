exports.run = (client, guild) => {
  console.log(`${Date.now()}: JOINED: ${guild.name} (${guild.id})`);
  let server = require("../data/server-default.json");
  server.ownerID = guild.ownerID;
  server.configversion = client.version;
  client.settings.set(guild.id, server);
}
