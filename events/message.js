exports.run = (client, message) => {
/*
  console.log(message.content);
*/



  // Ignore DMs
  if (message.channel.type !=='text') return;

  // Get information from enmap
  let server = client.settings.get(message.guild.id);


  if (message.content.startsWith(server.prefix)) {
    // Get command and arguments from message
    const args = message.content.slice(server.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    // If the command doesn't exist in commandList, do nothing
    if (!client.settings.get("commandList").includes(`${command}.js`)) return;

    //Set member's permission level based on their roles
    var matches = []
    message.member.authLevel = 0;
    if (message.member.id == server.ownerID) message.member.authLevel = 10;
    else {
      var permArray = Object.keys(server.perms)
      message.member.roles.cache.keyArray().forEach(function(element) {
        if (permArray.includes(element.toString())) {
          matches.push(server.perms[element]);
        }
      });
      if (matches.length == 0) message.member.authLevel = 0;
      else message.member.authLevel = Math.max(...matches)
    }

    // If no permission level has been set for command, set to server owner only
    if (server.commands[command] == undefined) server.commands[command] = 10;

    if (message.member.authLevel >= server.commands[command]) require(`../commands/${command}.js`).run(client, server, message, args);
    else message.channel.send("You don't have permission to use that command!");
    return;
  }


  // Check if posted in a webhook channel
  if (server.singlechannels.includes(message.channel.id)) {
    async function clear() {
      var fetched = await message.channel.messages.fetch({before: message.id});
      message.channel.bulkDelete(fetched);
    }
    clear();
    return;
  };


  // Check if posted in a voting channel
  if (server.votingchannels.includes(message.channel.id)) {
  // Extract custom emojis from message if present
    var matchedemojis = client.getMatches(message.content, client.regex.emoji, 1);
  // If no emojis are present, return
    if (matchedemojis.length === 0) {return;};
  // Otherwise, react with the matched emojis
    var i = 0   // Reset iteration to 0 before starting
    // Iterate reactions through the matched emojis
    var react = setInterval(function(){
      message.react(matchedemojis[i]).catch(logReactError);
      i++;
      if(i === matchedemojis.length) {
          clearInterval(react);
      }
    }, 550);
    return;
  }

  // Check if posted in a suggestion channel
  if (server.suggestchannels.includes(message.channel.id)) {
  // Get server's :upvote: and :downvote: emojis
    const upvote = client.emojis.cache.find(emoji => emoji.name === "upvote");
    const downvote = client.emojis.cache.find(emoji => emoji.name === "downvote");
  // React with said emojis
    message.react(upvote.id)
      .then( () => message.react(downvote.id) )
  // Catch any errors that may occur
      .catch(logReactError);
    return;
  };

  function logSendError(reason) {
    console.log(`${Date.now()}: ERROR: ${message.guild.name}: #${message.channel.name} -- ${reason}, while attempting to send message`);
  };
  function logReactError(reason) {
    console.log(`${Date.now()}: ERROR: ${message.guild.name}: #${message.channel.name} -- ${reason}, while attempting to add reaction`);
  };
}
