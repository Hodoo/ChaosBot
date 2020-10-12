exports.run = (client, oldMember, newMember) => {
  let server = client.settings.get(newMember.guild.id);
  let channels = server.rolechannels;


  let roleGains = newMember.roles.cache.array().filter(x => !oldMember.roles.cache.array().includes(x));
  let roleLosses = oldMember.roles.cache.array().filter(x => !newMember.roles.cache.array().includes(x));

  if (roleGains.length > 0) {
    if (Object.keys(server.gainMessages).includes(roleGains[0].id)) {
      var i;
      let message = client.replaceVars(newMember, server.gainMessages[roleGains[0].id]);
      for (i in channels) {
        newMember.guild.channels.cache.get(channels[i]).send(message);
      }
    }
  } else if (roleLosses.length > 0) {
    if (Object.keys(server.lossMessages).includes(roleLosses[0].id)) {
      var i;
      let message = client.replaceVars(newMember, server.lossMessages[roleLosses[0].id]);
      for (i in channels) {
        newMember.guild.channels.cache.get(channels[i]).send(message);
      }
    };
  };
}
