exports.run = (client, message) => {

  // Ignore DMs
  if (message.channel.type !=='text') return;

  // Get information from enmap
  let server = client.settings.get(message.guild.id);


  if (Object.keys(server.selfassigns).includes(message.id)) {
    delete server.selfassigns[message.id];
    console.log("A self-assign message was removed");
    client.settings.set(message.guild.id, server);
  };

}
