const Discord = require('discord.js');
const mineflayer = require("mineflayer");
const client = new Discord.Client();

let sending = false;
let chatData = [];

let prefix = ".";
let bot = mineflayer.createBot({
    version: "1.8",
    host: "pvplands.net",
    username: "email",
    password: "password",
})
var bot = mineflayer.createBot(options);
bindEvents(bot);

function bindEvents(bot) {
    bot.on('login', function() {
        console.log("Bot has logged in");
    });

    bot.on('spawn', function() {
        console.log("Bot has spawned");
    });

    bot.on('kicked', function(reason) {
        console.log("Kicked for ", reason);
    });

    bot.on('end', function(reason) {
        // Wait 10 seconds between tries, and try 9999 times
        waitUntil(5000, 9999, function condition() {
          try {
            console.log("Bot ended, attempting to reconnect...");
                bot = mineflayer.createBot(options);
                bindEvents(bot);
                return true;
           } catch (error) {
                console.log("Error: " + error);
                return false;
            }
            // Callback function that is only executed when condition is true or time allotted has elapsed
        }, function done(result) {
            console.log("Connection attempt result was: " + result);
        });
   });
}

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: "online",  //You can show online, idle....
        game: {
            name: "Skeppy Events",  //The message shown
            type: "PLAYING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
 });


bot.on("message", message => {
    if(sending == true) {
        chatData.push(`${message}`)
    }

})

client.on("message", async msg => {
    let args = msg.content.split(" ").slice(1)

    if(msg.content.startsWith("/send")) {
        let toSend = args.join(" ");
        if(!toSend) return msg.reply("No Args")

        bot.chat(toSend)
        sending = true
        msg.channel.send(`<@${msg.author.id}> just sent ${toSend}`)

        setTimeout(() => {
         sending = false
         msg.channel.send(chatData.join("\n"))
         chatData = []
     }, 750)
    } 
})


client.login("discord bot token")
