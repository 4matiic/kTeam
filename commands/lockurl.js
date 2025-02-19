const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'lockurl',
    description: 'Configurer le lockurl',
    async execute(message) {
        const userId = message.author.id;
        const guildId = message.guild.id;

        const config = require('../config.json');
        if (!config.ownerid || !Array.isArray(config.ownerid) || !config.ownerid.includes(userId)) {
            return message.reply("Désolé, vous n'êtes pas autorisé à modifier le verrouillage de l'URL.");
        }

        const serverConfigPath = path.resolve(__dirname, `../servers/${guildId}.json`);

        const loadServerConfig = () => {
            if (!fs.existsSync(serverConfigPath)) {
                fs.writeFileSync(serverConfigPath, JSON.stringify({ urlLock: false }, null, 4));
            }
            return JSON.parse(fs.readFileSync(serverConfigPath, 'utf-8'));
        };

        const saveServerConfig = (urlLockStatus) => {
            fs.writeFileSync(serverConfigPath, JSON.stringify({ urlLock: urlLockStatus }, null, 4));
        };

        const serverConfig = loadServerConfig();

        const embed = new EmbedBuilder()
            .setTitle('Lock Vanity')
            .setDescription(`Statut : **${serverConfig.urlLock ? 'Activé' : 'Désactivé'}**`)
            .setColor(serverConfig.urlLock ? '#00FF00' : '#FF0000')
            .setFooter({ text: 'Cliquez sur un bouton pour modifier le statut.' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lockurl_on')
                    .setLabel('Activer')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(serverConfig.urlLock),
                new ButtonBuilder()
                    .setCustomId('lockurl_off')
                    .setLabel('Désactiver')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(!serverConfig.urlLock)
            );

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: "Vous n'êtes pas autorisé à utiliser ce bouton.", ephemeral: true });
            }

            if (interaction.customId === 'lockurl_on') {
                serverConfig.urlLock = true;
            } else if (interaction.customId === 'lockurl_off') {
                serverConfig.urlLock = false;
            }

            saveServerConfig(serverConfig.urlLock);

            const updatedEmbed = EmbedBuilder.from(embed)
                .setDescription(`Statut : **${serverConfig.urlLock ? 'Activé' : 'Désactivé'}**`)
                .setColor(serverConfig.urlLock ? '#FF0000' : '#00FF00');

            const updatedRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lockurl_on')
                        .setLabel('Activer')
                        .setStyle(ButtonStyle.Danger)
                        .setDisabled(serverConfig.urlLock),
                    new ButtonBuilder()
                        .setCustomId('lockurl_off')
                        .setLabel('Désactiver')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(!serverConfig.urlLock)
                );

            await interaction.update({ embeds: [updatedEmbed], components: [updatedRow] });
        });

        collector.on('end', () => {
            sentMessage.edit({ components: [] });
        });
    }
};
