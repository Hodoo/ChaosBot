exports.run = (client) => {
  client.user.setActivity('your votes', { type: 'WATCHING' });
  console.log(`ChaosBot version: ${client.version}`);
  console.log("ChaosBot is running");
}
