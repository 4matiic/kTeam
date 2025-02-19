const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'teaminfo',
    description: 'Affiche les informations sur la team',
    async execute(message) {
        const guild = message.guild;

        const role = guild.roles.cache.get(config.roleid);
        if (!role) {
            return message.reply('Le rôle spécifié dans la configuration est introuvable.');
        }

        const membersWithRole = await guild.members.fetch();
        const membersWithTagRole = membersWithRole.filter(member => member.roles.cache.has(config.roleid)).size;

        const totalMembers = guild.memberCount;

        const totalBoosts = guild.premiumSubscriptionCount || 0;

        const members = await guild.members.fetch();

        const activeMembers = guild.members.cache.filter(
            m => m.presence?.status === 'online' ||
                 m.presence?.status === 'dnd' ||
                 m.presence?.status === 'streaming' ||
                 m.presence?.status === 'idle'
        ).size;

        const voiceMembers = members.filter(member => member.voice.channel).size;

        const embed = new EmbedBuilder()
            .setTitle(`Informations sur ${guild.name}`)
            .setThumbnail(guild.iconURL()) 
            .addFields(
                { name: '🏳️ Nombre de membres dans la team', value: `**${membersWithTagRole}**`, inline: true },
                { name: '🌍 Nombre de membres du serveur', value: `**${totalMembers}**`, inline: true },
                { name: '🟢 Membres en ligne', value: `**${activeMembers}**`, inline: true },
                { name: '🌺 Nombre de boosts', value: `**${totalBoosts}**`, inline: true },
                { name: '🎧 Membres en vocal', value: `**${voiceMembers}**`, inline: true },
                { name: '⚡ URL', value: `**${message.guild.vanityURLCode}**`, inline: true }
            )
            .setColor('#00FF00')
            .setFooter({ text: `${new Date().toLocaleString()}` });

        message.reply({ embeds: [embed] });
    }
};
