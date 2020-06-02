exports.run = (client, message) => {

  // Ignore DMs
  if (message.channel.type !=='text') return;

  // Get information from enmap
  let server = client.settings.get(message.guild.id);

  console.log(typeof message.id);
  console.log(typeof Object.keys(server.selfassigns)[0]);

  if (Object.keys(server.selfassigns).includes(message.id)) {
    delete server.selfassigns[message.id];
    console.log(Object.keys(server.selfassigns).toString()); // Testing line
    client.settings.set(message.guild.id, server);
  };

}
