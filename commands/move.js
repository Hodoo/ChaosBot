// Command to move members between voice channels.
exports.run = (client, server, message, args) => {
  if (!args[0]) {message.channel.send(`No input was provided.`); return;}
  var role;

  //Check if first argument specifies a role
  if (args[0].startsWith("<@&")) {
    var roleID = client.regex.user.exec(args[0])[1];
    role = message.guild.roles.cache.get(roleID);
    if (!role) {message.channel.send(`Role is invalid.`); return};
    args = args.slice(1);
  };

  if (args.includes("|")) {
    var newArgs = args.join(" ").split(" | ");
	} else {console.log("No separator included"); return};


  let oldChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === newArgs[0].toLowerCase() || channel.id === newArgs[0]);
  if (!oldChannel) {message.channel.send(`"${newArgs[0]}" does not exist.`); return;}
  if (oldChannel.type !== "voice") {message.channel.send(`"${newArgs[0]}" is not a voice channel.`); return;}

  let newChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === newArgs[1].toLowerCase() || channel.id === newArgs[1]);
  if (!newChannel) {message.channel.send(`"${newArgs[1]}" does not exist.`); return;}
  if (newChannel.type !== "voice") {message.channel.send(`"${newArgs[1]}" is not a voice channel.`); return;}

  oldChannel.members.each(user => {
    if (role) {
      if (!user.roles.cache.has(roleID)) return;
    }
    user.voice.setChannel(newChannel)
  });
}
