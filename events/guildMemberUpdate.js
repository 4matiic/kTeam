const { EmbedBuilder } = require('discord.js');

async function guildMemberUpdate(member, guild, config) {
    const role = guild.roles.cache.get(config.roleid);
    const logChannel = guild.channels.cache.get(config.logChannelID);

    const hasTag = config.tag.some(tag => member.displayName.includes(tag));

    if (!hasTag && role) {
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Kick membre')
                .setDescription(`${member} **(${member.id})** a été derank car il ne possède plus le tag !`)
                .setThumbnail(member.displayAvatarURL())
                .setTimestamp();

            if (logChannel) logChannel.send({ embeds: [embed] });

            await member.send(`Tu as été derank car tu as retiré le **tag** !`);
        }
    }

    if (hasTag && role && !member.roles.cache.has(role.id)) {
        await member.roles.add(role);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Nouveau membre')
            .setDescription(`${member} **(${member.id})** est désormais un membre de la team.`)
            .setThumbnail(member.displayAvatarURL())
            .setTimestamp();

        if (logChannel) logChannel.send({ embeds: [embed] });

        await member.send(`Tu as reçu le rôle **${role.name}** !`);
    }

    return null;
}

module.exports = { guildMemberUpdate };
