exports.run = (client, member) => {
  let server = client.settings.get(member.guild.id);
  if (server.leavechannels.length && server.leavemessages.length) {
    var i
    let channels = server.leavechannels;
    let randmsg = server.leavemessages[Math.floor(Math.random() * server.leavemessages.length)];
    let message = client.replaceVars(member, randmsg);
    for (i in channels) {
      member.guild.channels.get(channels[i]).send(message);
    }
  }
};
