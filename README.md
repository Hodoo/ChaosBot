# ChaosBot

A simple Discord bot to automatically add reactions to posts in voting and suggestion channels.

## Usage

ChaosBot keeps track of two types of channels, suggestion channels and voting channels.

In voting channels, ChaosBot will extract all *custom* emojis from any messages posted in the channel and react to the message with them, to easily set up multiple-choice reaction polls.


In suggestion channels, ChaosBot will react to any messages posted in the channel with the server's custom :upvote: and :downvote: emojis, to instantly enable voting on any number of suggestions.


### Commands
*The default prefix for commands is '!'*

`!prefix [x]` - Change the prefix for commands

`!suggest` - Toggles the current channel as a suggestion channel

`!voting` - Toggles the current channel as a voting channel

`!move (@role) [voice channel] | [voice channel]` - Moves members between voice channels, optionally with a specific role

`!singlechannel` - Toggles the current channel as a single-message channel

`!auth [command or @role] (1-10)` - Sets the permission level for the mentioned role or command

`!say [(#channel) message]` - Sends your message in the mentioned channel, or the current channel if omitted

`!reactions [#channel] [message ID]` - Outputs a list of all reactions to the specified message into a text file, accessible from the browsers

`!version` - Returns the current ChaosBot version

`!welcome/goodbye [command or #channel]`
  * `list` - returns a numbered list of current welcome or goodbye messages
  * `add [message]` - adds the message to list of welcome or goodbye messages
  * `remove [number]` - removes the selected message from the list of welcome or goodbye messages
  * `[#channel]` - toggles the mentioned channel as a welcome or goodbye channel

`!role [command or #channel]`
  * `list [gain/loss]` - returns a numbered list of current role gain or loss announcements
  * `add [@role] [gain/loss] [message]` - adds the message as an announcement for gaining or losing the mentioned role
  * `remove [gain/loss] [number]` - removes the selected announcement from the chosen list
  * `[#channel]` - toggles the mentioned channel as a role announcement channel

 Variables supported by welcome/goodbye messages and role announcements:
 * `$mention` - inserts a mention of the user
 * `$name` - inserts the user's username
 * `$nick` - inserts the nickname of the user if they have one, otherwise same as `$name`
 * `$disc` - inserts the user's four-digit discriminator, preceded by the number sign
 * `$id` - inserts the user's id number

`!roletimer [command or #channel]`
  * `list` - returns a numbered list of current role timers
  * `add [@role] [time] ([#channel] [message])` - sets up a daily time (in UTC, 24h format) to remove the mentioned role from all members
  * `remove [number]` - removes the selected role timer from the list


`!selfassign [command]`
  * `new [#channel] (@required_role |) [header text] | [:emote:] [@given_role] (...) (| footer text)` - creates a new embed in the specified channel for users to react for roles
  * `delete [message ID]` - deletes the specified self-assign embed
  * `edit [message ID] [command]` - edits the specified self-assign embed using the following sub-commands
    * `header/footer [new text]` - alters the header or footer text
    * `add [:emote:] [@role]` - adds the specified emote/role combination to the self-assign
    * `remove [:emote:]` - removes the specified emote and its corresponding role from the self-assign

#### Black Desert Online

 `!horse [coat] [level] [speed] [accel] [turn] [brake]` - Outputs data and prediction for the stats of a given horse


## Setup


Create a copy of `config-default.json` in the `data` folder and rename it `config.json`
- Add your bot's API token to the `token` field
- Add your Discord ID to the `ownerID` field
- Add the external IP or domain for your server in the `address` field. *(This should include the port from the `port` field, if your domain doesn't already point to it)*
- If desired, change the `port` field to your desired port *(Default: 3000)*


#### If self-hosting:
- Install [nodejs](https://nodejs.org)
- Install package
- Run `node bot.js`
