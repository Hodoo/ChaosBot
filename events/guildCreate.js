exports.run = (client, guild) => {
  if (client.settings.has(guild.id)) {
    console.log(`${Date.now()}: REJOINED: ${guild.name} (${guild.id})`);
  }
  else {
    console.log(`${Date.now()}: JOINED: ${guild.name} (${guild.id})`);
    let server = require("../data/server-default.json");
    server.ownerID = guild.ownerID;
    client.settings.set(guild.id, server);
  }
}
