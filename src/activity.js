const { EOL } = require("os");
const axios = require("axios");

module.exports = async function refreshActivity(user) {

    const LPFM_API_STATUS_URL = "https://laspegas.us/api/now";
    var lastSong = null;

    setInterval(async () => {

        axios.get(LPFM_API_STATUS_URL).then(res => {
            
            if (res.status != 200 || res.data.status != "ok") {
                console.error(`Błąd podczas wykonywania zapytania do API (URL: ${LPFM_API_STATUS_URL}) - zwrócono inny kod statusu niż 200 OK.` + EOL + res.data);
                return;
            }

            let song = `${res.data.artist} - ${res.data.title}`;
            if (song !== lastSong) {
                user.setActivity(`${song} @ #LPFM`, { type: "LISTENING" });
                lastSong = song;
                console.log(`Zmieniono status użytkownika na "${song} @ #LPFM"`);
            }

        }).catch(error => {
            console.error(`Błąd podczas wykonywania zapytania do API (URL: ${LPFM_API_STATUS_URL}).` + EOL + error);
        });

    }, 5000);

}