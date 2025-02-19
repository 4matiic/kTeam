const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'config',
    description: 'Permet de configurer l\'autorank',
    async execute(message) {
        const config = require('../config.json');

        if (!config.ownerId.includes(message.author.id)) {
            return message.reply("Vous n'avez pas la permission d'utiliser cette commande.");
        }

        const createEmbed = () => {
            const roleMention = config.roleid ? `<@&${config.roleid}>` : 'Non défini';
            return new EmbedBuilder()
                .setTitle('Panel de configuration')
                .setFooter({text: 'developped by kays'})
                .setDescription('Utilisez les boutons ci-dessous pour configurer le bot.')
                .setColor('ff0000')
                .addFields(
                    { name: 'Role', value: roleMention, inline: true },
                    { name: 'Log Channel ID', value: typeof config.logChannelID === 'string' ? config.logChannelID : 'Non défini', inline: true },
                    { name: 'Tags', value: Array.isArray(config.tag) ? config.tag.join(', ') : 'Non défini', inline: true }
                )
                .setThumbnail(message.guild.iconURL());
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('setRoleId')
                    .setLabel('Configurer l\'ID du rôle')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('setLogChannelId')
                    .setLabel('Configurer le Log Channel ID')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('addTag')
                    .setLabel('Ajouter un tag')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('deleteTag')
                    .setLabel('Supprimer un tag')
                    .setStyle(ButtonStyle.Primary)
            );

        const replyMessage = await message.reply({ embeds: [createEmbed()], components: [row] });

        const filter = interaction => interaction.user.id === message.author.id;

        const collector = replyMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (interaction) => {
            if (!interaction.isButton()) return;

            let newValue;

            if (interaction.customId === 'setRoleId') {
                await interaction.reply('Quel est le nouvel ID du rôle ?');
            } else if (interaction.customId === 'setLogChannelId') {
                await interaction.reply('Quel est le nouvel ID du canal de logs ?');
            } else if (interaction.customId === 'addTag') {
                await interaction.reply('Quel tag souhaitez-vous ajouter ?');
            } else if (interaction.customId === 'deleteTag') {
                const tagsToDisplay = config.tag.join(', ') || 'Aucun tag défini';
                await interaction.reply(`Voici les tags actuels : ${tagsToDisplay}.\nQuel tag souhaitez-vous supprimer ?`);
            }

            const response = await message.channel.awaitMessages({ 
                filter: m => m.author.id === message.author.id, 
                max: 1, 
                time: 50000, 
                errors: ['time'] 
            }).catch(() => {
                return interaction.followUp("Temps écoulé ! Aucune réponse reçue.");
            });

            if (!response || response.size === 0) return;

            newValue = response.first().content;

            await response.first().delete().catch(console.error);
            await interaction.deleteReply().catch(console.error);

            if (interaction.customId === 'setRoleId') {
                config.roleid = newValue;
            } else if (interaction.customId === 'setLogChannelId') {
                config.logChannelID = newValue;
            } else if (interaction.customId === 'addTag') {
                const newTags = newValue.split(',').map(tag => tag.trim());
                config.tag = Array.from(new Set([...config.tag, ...newTags]));
            } else if (interaction.customId === 'deleteTag') {
                const tagToRemove = newValue.trim();
                config.tag = config.tag.filter(tag => tag !== tagToRemove);
            }

            fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8');

            await replyMessage.edit({ embeds: [createEmbed()] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send("Aucune sélection n'a été faite dans le temps imparti.");
            }
        });
    }
};
