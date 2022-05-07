const { EOL } = require("os");
const { exit } = require("process");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Intents, Client } = require("discord.js");
const commands = require("./commands/commands");
const refreshActivity = require("./activity");

const GlobalCommands = [
    {
        name: "about",
        description: "Wyświetl informacje o aplikacji i jej autorach."
    }
];

const LPFMOnlyCommands = [
    {}
];

async function main() {

    const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!DISCORD_CLIENT_ID || !DISCORD_TOKEN) {
        console.error("Nie wskazano tokenu logowania lub identyfikatora klienta (zmienne środowiskowe DISCORD_CLIENT_ID, DISCORD_TOKEN).");
        exit(1);
    }

    if (!DISCORD_GUILD_ID) {
        console.warn("Nie wskazano identyfikatora serwera Discord (zmienna środowiskowa DISCORD_GUILD_ID) - polecenia z nim powiązane mogą być niedostępne.");
    }

    console.log("Inicjalizacja obiektów i logowanie do Discord...");
    const Rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

    try {
        await Rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: GlobalCommands });
        //await Rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), { body: LPFMOnlyCommands });
        console.log("Wysłano tablicę poleceń.");
    } catch (error) {
        console.error("Błąd rejestracji poleceń w Discord REST API:" + EOL + error);
        exit(1);
    }

    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    client.on("ready", () => {
        console.log(`Zalogowano do Discord jako ${client.user.tag}.`);
        refreshActivity(client.user);
    });

    client.on("interactionCreate", async interaction => {

        if (!interaction.isCommand()) {
            return;
        }

        // --- --- --- --- --- --- --- ---

        if (interaction.commandName.toLowerCase() == "about") {
            return await commands.about(interaction);
        }

    });

    console.log("Zarejestrowano eventy.");
    client.login(DISCORD_TOKEN);

}

main();
