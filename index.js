const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { guildMemberUpdate } = require('./events/guildMemberUpdate');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences
    ] 
});


client.config = config; 
client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const member = message.member;

    const resultMessage = await guildMemberUpdate(member, message.guild, config);
    if (resultMessage) {
        await message.channel.send(resultMessage);
    }


    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (command) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(error);
            }
        }
    } else if (message.mentions.has(client.user)) {
        const command = client.commands.get('autorank');
        if (command) {
            try {
                await command.execute(message);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

client.login(config.token);
