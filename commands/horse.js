// Make the bot say whatever you want, wherever you want
exports.run = (client, server, message, args) => {
  const Discord = require('discord.js');

  if (args.length != 6) {message.channel.send(`Error: Incorrect number of arguments.`); return;};


  const coats = {
      "T9A":[1375,1225,"89"],
      "T9B":[1330,1270,"88"],
      "T9C":[1300,1398,"87"],

      "T8A":[1315,1225,"79"],
      "T8B":[1285,1255,"71"],
      "T8C":[1288,1360,"80"],
      "T8D":[1300,1240,"76"],
      "T8E":[1360,1120,"83"],

      "T7A":[1287,1210,"17"],
      "T7B":[1315,1105,"45"],
      "T7C":[1273,1315,"61"],
      "T7D":[1270,1210,"72"],
      "T7E":[1210,1270,"67"],
      "T7G":[1240,1240,"68"],
      "T7H":[1270,1270,"69"],
      "T7I":[1270,1210,"82"],
      "T7J":[1255,1285,"77"],

      "T6A":[1210,1270,"09"],
      "T6B":[1210,1210,"15"],
      "T6C":[1180,1240,"19"],
      "T6D":[1180,1180,"20"],
      "T6E":[1195,1225,"35"],
      "T6F":[1165,1255,"42"],
      "T6G":[1225,1135,"46"],
      "T6H":[1255,1225,"49"],
      "T6I":[1245,1285,"50"],
      "T6J":[1210,1210,"52"],
      "T6K":[1210,1210,"53"],
      "T6L":[1180,1180,"54"],
      "T6M":[1165,1255,"55"],
      "T6N":[1270,1150,"56"],
      "T6O":[1225,1255,"85"],
      "T6P":[1180,1240,"81"],
      "T6Q":[1225,1255,"74"],
      "T6R":[1180,1240,"75"],
      "T6S":[1225,1255,"78"],
      "T6T":[1210,1210,"73"],
      "T6U":[1225,1255,"70"]
    };

    const ranges = {
      "9":[1,13],
      "8":[1,12],
      "7":[1,11],
      "6":[1,10]
    };

    if (coats[args[0].toUpperCase()]) {

      var coat = args[0].toUpperCase();
      var tier = args[0].slice(1, 2);
    	var average = (ranges[tier][0]+ranges[tier][1])/2
      var level = Number(args[1]);
      if (level > 30 || level < 1) {message.channel.send(`Error: Invalid level.`); return;};
      if (level == 1) {message.channel.send(`Really? It's level one.`); return;};
      var speed = Number(args[2]);
      if (speed < 1000) {speed = Math.round(speed*10)};
    	var speedGain = speed-coats[coat][0];
      var accel = Number(args[3]);
      if (accel < 1000) {accel = Math.round(accel*10)};
    	var accelGain = accel-coats[coat][0];
      var turn = Number(args[4]);
      if (turn < 1000) {turn = Math.round(turn*10)};
    	var turnGain = turn-coats[coat][1];
      var brake = Number(args[5]);
      if (brake < 1000) {brake = Math.round(brake*10)};
    	var brakeGain = brake-coats[coat][1];
    	if (level < 30) {
        var speedProjection = ", Projected: "+Number.parseFloat((speed+average*(30-level))/10).toFixed(1);
        var accelProjection = ", Projected: "+Number.parseFloat((accel+average*(30-level))/10).toFixed(1);
        var turnProjection = ", Projected: "+Number.parseFloat((turn+average*(30-level))/10).toFixed(1);
        var brakeProjection = ", Projected: "+Number.parseFloat((brake+average*(30-level))/10).toFixed(1);
      } else {
        var speedProjection = "";
        var accelProjection = "";
        var turnProjection = "";
        var brakeProjection = "";
      };

      var embed = new Discord.RichEmbed()
        .setColor("#f712ff")
        .setAuthor(`${message.member.nickname}'s ${coat} L${level}`)
        .setThumbnail(`https://bdocodex.com/items/new_ui_common_forlua/window/stable/horse_${coats[coat][2]}.png`)
        .setDescription("Tier " +tier+" horses gain "+ranges[tier][0]/10+"-"+ranges[tier][1]/10+" each level ("+Number.parseFloat(average/10).toFixed(2)+" average)")
        .addField("Speed ("+Number.parseFloat(speed/10).toFixed(1)+")", "Gain: "+Number.parseFloat(speedGain/10).toFixed(1)+" ("+Number.parseFloat((speedGain/(level-1))/10).toFixed(2)+" per level)"+speedProjection)
        .addField("Accel ("+Number.parseFloat(accel/10).toFixed(1)+")", "Gain: "+Number.parseFloat(accelGain/10).toFixed(1)+" ("+Number.parseFloat((accelGain/(level-1))/10).toFixed(2)+" per level)"+accelProjection)
        .addField("Turn ("+Number.parseFloat(turn/10).toFixed(1)+")", "Gain: "+Number.parseFloat(turnGain/10).toFixed(1)+" ("+Number.parseFloat((turnGain/(level-1))/10).toFixed(2)+" per level)"+turnProjection)
        .addField("Brake ("+Number.parseFloat(brake/10).toFixed(1)+")", "Gain: "+Number.parseFloat(brakeGain/10).toFixed(1)+" ("+Number.parseFloat((brakeGain/(level-1))/10).toFixed(2)+" per level)"+brakeProjection)

      message.channel.send(embed)

  } else {
    message.channel.send(`Error: Coat does not exist or is not currently supported.`);
    return;
  }
}
