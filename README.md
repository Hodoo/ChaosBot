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

`!auth [command or @role] (1-10)` - Sets the permission level for the mentioned role or command

`!say [(#channel) message]` - Sends your message in the mentioned channel, or the current channel if omitted

`!version` - Returns the current ChaosBot version

`!welcome/goodbye [command or #channel]`
  * `list` - returns a numbered list of current welcome or goodbye messages
  * `add [message]` - adds the message to list of welcome or goodbye messages
  * `remove [number]` - removes the selected message from the list of welcome or goodbye messages
  * `[#channel]` - toggles the mentioned channel as a welcome or goodbye channel

 Variables supported by welcome/goodbye messages:
 * `$mention` - inserts a mention of the user
 * `$name` - inserts the user's username
 * `$nick` - inserts the nickname of the user if they have one, otherwise same as `$name`
 * `$disc` - inserts the user's four-digit discriminator, preceded by the number sign
 * `$id` - inserts the user's id number


## Setup


Create a copy of `config-default.json` in the `data` folder and rename it `config.json`
- Add your bot's API token to the `token` field
- Add your Discord ID to the `ownerID` field
- If desired, change the `port` field to your desired port *(Default: 3000)*


#### If hosting on Glitch:
- Don't change `port` in the config
- Everything should work
- Set up downtime monitoring (e.g. with Uptime Robot) to prevent sleeping


#### If self-hosting:
- Install [nodejs](https://nodejs.org)
- Install package
- Run `node bot.js`
