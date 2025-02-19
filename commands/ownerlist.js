const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { description } = require('./help');

module.exports = {
    name: 'ownerlist',
    description: 'Permet d\'afficher la liste des owners',
    async execute(message) {
        const config = require('../config.json');

        if (!config.devid.includes(message.author.id)) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }

        const embed = new EmbedBuilder()
            .setTitle('Liste des Owners')
            .setColor('#ff0000');

        const ownersList = config.ownerId.length > 0 
            ? config.ownerId.map(ownerId => `<@${ownerId}>・**${ownerId}**`).join('\n') 
            : "Aucun owner n'est défini.";

        embed.setDescription(ownersList);
        embed.setFooter({text: 'developped by kays'})
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('addOwner')
                    .setLabel('Ajouter un Owner')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('removeOwner')
                    .setLabel('Retirer un Owner')
                    .setStyle(ButtonStyle.Danger)
            );

        const replyMessage = await message.reply({ embeds: [embed], components: [row] });

        const filter = interaction => interaction.user.id === message.author.id;

        const collector = replyMessage.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'addOwner') {
                await interaction.reply("Veuillez entrer l'ID à ajouter comme owner.");
                
                const response = await message.channel.awaitMessages({ 
                    filter: m => m.author.id === message.author.id, 
                    max: 1, 
                    time: 30000, 
                    errors: ['time'] 
                }).catch(() => {
                    return interaction.followUp("Temps écoulé ! Aucune réponse reçue.");
                });

                if (response && response.size > 0) {
                    const input = response.first().content.trim();
                    const newOwnerId = interaction.guild.members.cache.find(member => member.user.id === input || member.user.username === input)?.id || input;

                    if (config.ownerId.includes(newOwnerId)) {
                        return interaction.followUp("Cet ID est déjà un owner.");
                    }

                    config.ownerId.push(newOwnerId);
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8');

                    await interaction.followUp(`L'ID \`${newOwnerId}\` a été ajouté comme owner.`);
                }
            } else if (interaction.customId === 'removeOwner') {
                await interaction.reply("Veuillez entrer l'ID de l'utilisateur à retirer des owners.");
                
                const response = await message.channel.awaitMessages({ 
                    filter: m => m.author.id === message.author.id, 
                    max: 1, 
                    time: 30000, 
                    errors: ['time'] 
                }).catch(() => {
                    return interaction.followUp("Temps écoulé ! Aucune réponse reçue.");
                });

                if (response && response.size > 0) {
                    const input = response.first().content.trim();
                    const ownerIdToRemove = interaction.guild.members.cache.find(member => member.user.id === input || member.user.username === input)?.id || input;

                    if (!config.ownerId.includes(ownerIdToRemove)) {
                        return interaction.followUp("Cet ID n'est pas dans la liste des owners.");
                    }

                    config.ownerId = config.ownerId.filter(id => id !== ownerIdToRemove);
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8');

                    await interaction.followUp(`L'ID **${ownerIdToRemove}** n'est plus owner.`);
                }
            }

            const updatedEmbed = new EmbedBuilder()
                .setTitle('Liste des Owners')
                .setColor('#ff0000');

            const updatedOwnersList = config.ownerId.length > 0 
                ? config.ownerId.map(ownerId => `<@${ownerId}>・**${ownerId}**`).join('\n') 
                : "Aucun owner n'est défini.";

            updatedEmbed.setDescription(updatedOwnersList);

            await replyMessage.edit({ embeds: [updatedEmbed] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send("Aucune action n'a été effectuée dans le temps imparti.");
            }
        });
    }
};
