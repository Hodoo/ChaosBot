// Command to return current version number
exports.run = (client, server, message, args) => {
  message.channel.send(`Currently running ChaosBot v${client.version}`);
  return;
}
