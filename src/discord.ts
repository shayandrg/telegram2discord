const axios = require('axios')
var querystring = require('querystring')

var discord_access_token = null

export function startOAuth() {
    
    axios.post('https://discord.com/api/v9/oauth2/token', querystring.stringify({
        client_id: process.env.DISCORD_OAUTH_CLIENT_ID,
        client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET,
        code: process.env.DISCORD_OAUTH_CODE,
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:3000`,
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

export default class Discord {
    constructor(app) {
        async function koss() {

            const users = await app.db.app.findMany()
            console.log('kos',users);
        }
        koss()
        
    }
}