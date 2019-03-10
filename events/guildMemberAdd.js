exports.run = (client, member) => {
  let server = client.settings.get(member.guild.id);
  if (server.greetchannels.length && server.greetmessages.length) {
    var i
    let channels = server.greetchannels;
    let randmsg = server.greetmessages[Math.floor(Math.random() * server.greetmessages.length)];
    let message = client.replaceVars(member, randmsg);
    for (i in channels) {
      member.guild.channels.get(channels[i]).send(message);
    }
  }
};
