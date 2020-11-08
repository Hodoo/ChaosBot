exports.run = (client) => {
  let lastGuilds = Array.from(client.settings.keys());
  lastGuilds.splice(lastGuilds.indexOf('commandList'), 1);
  lastGuilds.splice(lastGuilds.indexOf('address'), 1);
  if (lastGuilds.indexOf('lastVersion') > -1) {
    lastGuilds.splice(lastGuilds.indexOf('lastVersion'), 1);
  }
  let currentGuilds = Array.from(client.guilds.cache.keys());

  let guildGains = currentGuilds.filter(x => !lastGuilds.includes(x));
  let guildLosses = lastGuilds.filter(x => !currentGuilds.includes(x));

  // If any servers have been gained or lost since last start, add/remove them
  if (guildGains.length > 0) {
    let i;
    let server = require("../data/server-default.json");
    for (i in guildGains) {
      let guild = client.guilds.cache.get(guildGains[i])
      server.ownerID = guild.ownerID;
      client.settings.set(guild.id, server);
      console.log(`${guild.name} (${guild.id}) was missing and has been added`)
    };
  };
  if (guildLosses.length > 0) {
    let i;
    for (i in guildLosses) {
      client.settings.delete(guildLosses[i]);
      console.log(`${guildLosses[i]} no longer exists and has been removed`)
    };
  };

  // Update server settings, if not newest version
  if (!client.settings.get("lastVersion") || client.settings.get("lastVersion") !== client.version) {
    console.log(`An update has occured since last launch. All servers' settings will be updated.`)
    let serverdefault = require("../data/server-default.json");
    let i;
    for (i in currentGuilds) {
      let guild = client.guilds.cache.get(currentGuilds[i]);
      let server = client.settings.get(currentGuilds[i]);
      server = Object.assign(serverdefault, server);
      client.settings.set(currentGuilds[i], server);
      console.log(`${guild.name} (${guild.id}) settings have been updated to newest version`);
    }
    client.settings.set("lastVersion", client.version);
  }

  client.user.setActivity('your votes', { type: 'WATCHING' });
  console.log(`ChaosBot version: ${client.version}`);
  console.log("ChaosBot is running");
}
