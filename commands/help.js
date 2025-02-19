const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles.',
    async execute(message) {

        const helpEmbed = new EmbedBuilder()
            .setTitle('Liste des commandes')
            .setColor(config.color)
            .setFooter({ text: 'developped by kays' })
            .setThumbnail("https://cdn.discordapp.com/attachments/1300790097460854797/1301014669154189322/554d6bef7a85cf93e7bbcaf82784555f.png");

        helpEmbed.addFields(
            { name: `${config.prefix}help`, value: 'Affiche la liste des commandes disponibles.', inline: false },
            { name: `${config.prefix}config`, value: 'Permet de configurer l\'autorank.', inline: false },
            { name: `${config.prefix}lockurl`, value: 'Configurer le lockurl', inline: false },
            { name: `${config.prefix}ownerlist`, value: 'Permet d\'afficher la liste des owners', inline: false },
            { name: `${config.prefix}teaminfo`, value: 'Affiche les informations sur la team', inline: false },

        );

        await message.channel.send({ embeds: [helpEmbed] });
    },
};
