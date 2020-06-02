exports.run = (client, message) => {

  // Ignore DMs
  if (message.channel.type !=='text') return;

  // Get information from enmap
  let server = client.settings.get(message.guild.id);

  if (Object.keys(server.selfassigns).includes(message.id.toString())) {
    delete server.selfassigns[message.id.toString()];
    console.log(Object.keys(server.selfassigns).toString()); // Testing line
    client.settings.set(message.guild.id, server);
  };

}
