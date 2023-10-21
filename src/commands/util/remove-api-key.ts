import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { CommandInteraction } from "discord.js";

import { emojis as emoji } from "../../config";

import API from "../../models/API";

const command: Command = {
    name: "remove-api-key",
    description: "Remove your API key for the public panel.",
    options: [],
    default_member_permissions: null,
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    ownerOnly: false,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: CommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const data = await API.findOne({ _id: interaction.user.id });

            if(!data || !data.public_panel_key) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You don't have an API key set for the public panel!`);

                await interaction.editReply({ embeds: [error] });
                return;
            }

            // Set public_panel_key to null
            data.public_panel_key = null;
            await data.save();

            const removed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Your public panel API key has been removed!`);

            await interaction.editReply({ embeds: [removed] });
        } catch (err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
