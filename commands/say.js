// Make the bot say whatever you want, wherever you want
exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`No message was provided.`); return;}
  if (args[0].startsWith("<#")) {
    let channel = message.guild.channels.cache.get(client.regex.channel.exec(args[0])[1]);
    if (!channel) {
      message.channel.send("Channel not found.");
      return;
    }
    let newmsg = args.slice(1).join(" ");
    if (!newmsg) {message.channel.send(`No message was provided.`); return;}
    channel.send(newmsg);
  } else {
    let newmsg = args.join(" ");
    message.channel.send(newmsg);
  }
}
