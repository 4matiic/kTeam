const config = require('../config.json');
const colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  });

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
            client.user.setActivity('/uhqfr', { type: 'PLAYING' });
        
            const guild = client.guilds.cache.first();
            console.log(``);
            console.log(`
        
                      ██╗  ██╗████████╗███████╗ █████╗ ███╗   ███╗
                      ██║ ██╔╝╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
                      █████╔╝    ██║   █████╗  ███████║██╔████╔██║
                      ██╔═██╗    ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
                      ██║  ██╗   ██║   ███████╗██║  ██║██║ ╚═╝ ██║
                      ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
                                            
                                `.cyan);
            console.log(` ──────────────────────────────────────────────────────────────────`.blue);
            console.log(`|-->  Developped by 4matic`.blue);
            console.log(`|──────────────────────────────────────────────────────────────────|`.blue);
            console.log(`|-->  Nom du bot : ${client.user.username}`.blue);
            console.log(`|──────────────────────────────────────────────────────────────────|`.blue);
            console.log(`|-->  Prefix : ${config.prefix}`.blue);
            console.log(`|──────────────────────────────────────────────────────────────────|`.blue);
            console.log(`|-->  Serveur : ${guild.name}`.blue);
            console.log(`|──────────────────────────────────────────────────────────────────|`.blue);
            console.log(`|-->  Tag : ${config.tag}`.blue);
            console.log(` ──────────────────────────────────────────────────────────────────`.blue);
    },
};
