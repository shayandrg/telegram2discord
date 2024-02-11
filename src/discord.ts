const fs = require('fs')
import { Client, GatewayIntentBits,Events } from 'discord.js';

export default class Discord {
    app = null
    isUploading = false
    bot = null
    targetChannel = null
    requestHeaders = {
        'host': 'discord.com',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fa;q=0.8,ar;q=0.7,zh-CN;q=0.6,zh;q=0.5',
        'Authorization': process.env.DISCORD_USER_AUTH_TOKEN,
        'Cookie': '__dcfduid=79388a78bb8c11edae85c202ffb24dd9; __sdcfduid=79388a78bb8c11edae85c202ffb24dd9d967da0acd5f280e3cb8da42fd94c271324c9590c35e16084d80dddcad4b6367; locale=en-US; OptanonAlertBoxClosed=2023-05-12T07:53:26.343Z; _gcl_au=1.1.991363464.1701992878; _ga_Q149DFWHT7=GS1.1.1706837786.2.0.1706837789.0.0.0; OptanonConsent=isIABGlobal=false&datestamp=Fri+Feb+02+2024+05%3A40%3A35+GMT%2B0330+(Iran+Standard+Time)&version=6.33.0&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1&geolocation=PL%3B22&AwaitingReconsent=false; _ga=GA1.2.774637880.1701992878; _ga_YL03HBJY7E=GS1.1.1706839836.2.1.1706839865.0.0.0; cf_clearance=sKySKmdj2Pmn0R9obmfLgDKnTCWlOPZ3_503WxLgjhM-1707255294-1-AaCwCQOCZG7cb0T4dEb3QTShb8E2WXgfDwxaDsahePrclSLvQtfopQ3JCtqGLBRWEL/uu84VgL1TfXpI7LdJyts=; __cfruid=d84448e9f950557c6bb14c1174d22c1bbf0203e1-1707255295; _cfuvid=5BQetQqUzQZcjnHqHXzAUI1Iap50sa47pqFEn1dFtJo-1707255295096-0-604800000',
        'Referer': `https://discord.com/channels/${process.env.DISCORD_USER_UPLOAD_GUILD_ID}/${process.env.DISCORD_USER_UPLOAD_CHANNEL_ID}`,
        'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'X-Debug-Options': 'bugReporterEnabled',
        'X-Discord-Locale': 'en-US',
        'X-Discord-Timezone': 'Asia/Tehran',
        'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEyMS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTIxLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL2RyZWFtc3JwLmlyLyIsInJlZmVycmluZ19kb21haW4iOiJkcmVhbXNycC5pciIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoyNjM4MjYsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9'
    }
    uploadRequestHeaders = {
        // 'host': 'https://discord.com',
        // 'Accept': '*/*',
        // 'Accept-Encoding': 'gzip, deflate, br',
        // 'Accept-Language': 'en-US,en;q=0.9,fa;q=0.8,ar;q=0.7,zh-CN;q=0.6,zh;q=0.5',
        // 'Referer': `https://discord.com/channels/${process.env.DISCORD_USER_UPLOAD_GUILD_ID}/${process.env.DISCORD_USER_UPLOAD_CHANNEL_ID}`,
        // 'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        // 'Sec-Ch-Ua-Mobile': '?0',
        // 'Sec-Ch-Ua-Platform': '"Windows"',
        // 'Sec-Fetch-Dest': 'empty',
        // 'Sec-Fetch-Mode': 'cors',
        // 'Sec-Fetch-Site': 'same-origin',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Content-Type': 'application/octet-stream'
    }

    constructor(app) {
        this.app = app
              
        this.bot = new Client({ intents: [ GatewayIntentBits.Guilds, 'GuildMessages', 'MessageContent' ] });
        this.bot.on('ready', () => {
            console.log(`Logged in as ${this.bot.user.tag}!`);
            this.targetChannel = this.bot.channels.cache.get(process.env.DISCORD_SEND_CHANNEL_ID);
            if (!this.targetChannel) {
                console.error(`Channel with ID ${process.env.DISCORD_SEND_CHANNEL_ID} not found.`);
                return;
            }
        })
        this.bot.login(process.env.DISCORD_BOT_TOKEN);
        this.runUploadQueue()       
    }

    async runUploadQueue() {
        await this.app.db.discordUploadQueue.findFirst({
            where: { isUploading: false }
        })
        .then(res => {
            if (res) this.upload(res)
        })
        .catch(err => {
            console.log('[discord@runUploadQueue]: ', err?.response)
        })
    }

    async upload({ id, fileName, fileSize }) {
        if (!this.isUploading) {
            console.log('start uploading');
            this.isUploading = true
            await this.app.db.discordUploadQueue.update({
                where: { id },
                data: {
                    isUploading: true,
                }
            })

            let fileBuffer = null
            try {
                fileBuffer = fs.readFileSync(`./downloads/${fileName}`)
            } catch (err) {
                console.log('[discord@upload:readFileSync]', err)
                throw new Error()
            }
            
            const { data: uploadInfo } = await this.app.axios.post(`${process.env.DISCORD_API_URL}/channels/${process.env.DISCORD_USER_UPLOAD_CHANNEL_ID}/attachments`, {
                'files': [
                    {
                        filename: fileName,
                        file_size: fileSize,
                        'id': '3',
                        'is_clip': false
                    }
                ]
            }, {
                headers: this.requestHeaders
            })
            .catch(err => {
                console.log('[discord@upload:attachments]', err?.response?.data)
                throw new Error()
            })

            await this.app.axios.put(uploadInfo.attachments[0].upload_url, fileBuffer, {
                // headers: { ...this.uploadRequestHeaders, 'Content-Length': fileSize }
                headers: this.uploadRequestHeaders
            })
            .catch(err => {
                console.log('[discord@upload:put]', err)
                throw new Error()
            })

            const { data: messageInfo } = await this.app.axios.post(`${process.env.DISCORD_API_URL}/channels/${process.env.DISCORD_USER_UPLOAD_CHANNEL_ID}/messages`, {
                'content': '',
                'nonce': `12038332507456${Math.floor(Math.random()*90000) + 10000}`,
                'channel_id': process.env.DISCORD_USER_UPLOAD_CHANNEL_ID,
                'type': 0,
                'sticker_ids': [],
                'attachments': [
                    {
                        'id': '0',
                        'filename': `${fileName}`,
                        'uploaded_filename': uploadInfo.attachments[0].upload_filename                    
                    }
                ]
            }, {
                headers: this.requestHeaders
            })
            .catch(err => {
                console.log('[discord@upload:messages]', err?.response?.data)
                throw new Error()
            })

            await this.app.db.file.create({
                data: {
                    fileName,
                    fileSize,
                    url: messageInfo.attachments[0].url
                }
            })

            await this.app.db.discordUploadQueue.delete({
                where: { id }
            })

            fs.unlink(`./downloads/${fileName}`, err => {
                if (err) {
                    console.log('[discord@upload:unlink]', err)
                    throw new Error()
                }
            })

            console.log('finish uploading');
            this.sendMessageToTargetChannel(messageInfo.attachments[0].url)
            this.isUploading = false
            this.runUploadQueue()
        }
    }

    async sendMessageToTargetChannel(content) {
        await this.targetChannel.send(content).then(res => {
            console.log(res);
        })
    }
}