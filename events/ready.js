exports.run = (client) => {
  let currentGuilds = Array.from(client.guilds.keys());

  // Update server settings, if not newest version
  if (!client.settings.get("lastVersion") || client.settings.get("lastVersion") !== client.version) {
    console.log(`An update has occured since last launch. All servers' settings will be updated.`)
    let serverdefault = require("../data/server-default.json");
    let i;
    for (i in currentGuilds) {
      let guild = client.guilds.get(currentGuilds[i]);
      let server = client.settings.get(currentGuilds[i]);
      server = Object.assign(serverdefault, server);
      console.log(`${guild.name} (${guild.id}) settings have been updated to newest version`);
    }
    client.settings.set("lastVersion", client.version);
  }

  client.user.setActivity('your votes', { type: 'WATCHING' });
  console.log(`ChaosBot version: ${client.version}`);
  console.log("ChaosBot is running");
}
