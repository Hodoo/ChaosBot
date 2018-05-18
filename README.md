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


## Dependencies

[Express](https://expressjs.com/) 4.16.3

[discord.js](https://discord.js.org/) 11.3.2


## Setup


Create a copy of `config-default.json` in the `data` folder and rename it `config.json`
- Add your bot's API token to the `token` field
- Add your Discord ID to the `ownerID` field


#### If hosting on Glitch:
- Everything should work


#### If self-hosting:
- Install [nodejs](https://nodejs.org)
- Install dependencies
- Remove the 'Glitch section' from `bot.js`
- Run `node bot.js`
