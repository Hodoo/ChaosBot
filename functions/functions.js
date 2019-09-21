module.exports = (client) => {

  // RegEx  Patterns
  client.regex = []
  client.regex.channel = /<#(\d+)>/;
  client.regex.user = /(\d+)>/;
  client.regex.emoji = /<:\w+:(\d+)>/g;

// Function to replace variables in messages
  client.replaceVars = function(member, message) {
    return message
      .replace(/\$mention/g, `<@${member.id}>`)
      .replace(/\$nick/g, member.displayName)
      .replace(/\$name/g, member.user.username)
      .replace(/\$disc/g, `#${member.user.discriminator}`)
      .replace(/\$id/g, member.id);
  };

// Function for RegEx
  client.getMatches = function(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  };

// Function to iterate through timers
  client.runTimers = function() {
    let currentGuilds = Array.from(client.guilds.keys());
    let i;
    for (i in currentGuilds) {
      let guild = client.guilds.get(currentGuilds[i]);
      let server = client.settings.get(currentGuilds[i]);
      let x;
      for (x in server.roletimers) {
        if (Date.now() > server.roletimers[x][0]) {
          let role = guild.roles.get(server.roletimers[x][1]);
          if (role) {
            if (role.members.size > 0) {
              role.members.forEach(member => {member.removeRole(role.id)});
              if (server.roletimers[x][2] && server.roletimers[x][3]) {
                guild.channels.get(server.roletimers[x][2]).send(server.roletimers[x][3]);
              };
            }
          }
          server.roletimers[x][0] += Math.ceil((Date.now()-server.roletimers[x][0])/86400000)*86400000;
          client.settings.set(currentGuilds[i], server);
        }
      }
    }
  };

}
