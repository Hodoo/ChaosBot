module.exports = (client) => {

  // RegEx  Patterns
  client.regex = []
  client.regex.channel = /<#(\d+)>/;
  client.regex.user = /(\d+)>/;
  client.regex.emoji = /<:\w+:(\d+)>/g;

// Function to replace variables in messages
  client.replaceVars = function(member, message) {
    return message
      .replace(/\$mention/g, `<@${member.id}>`)
      .replace(/\$nick/g, member.displayName)
      .replace(/\$name/g, member.user.username)
      .replace(/\$disc/g, `#${member.user.discriminator}`)
      .replace(/\$id/g, member.id);
  };

// Function for RegEx
  client.getMatches = function(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  };
}
