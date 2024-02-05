const fs = require('fs')
const axios = require('axios')

export default class Discord {
    app = null
    requestHeaders = {
        host: 'discord.com',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fa;q=0.8,ar;q=0.7,zh-CN;q=0.6,zh;q=0.5',
        'Authorization': process.env.DISCORD_USER_AUTH_TOKEN,
        'Cookie': '__dcfduid=79388a78bb8c11edae85c202ffb24dd9; __sdcfduid=79388a78bb8c11edae85c202ffb24dd9d967da0acd5f280e3cb8da42fd94c271324c9590c35e16084d80dddcad4b6367; locale=en-US; OptanonAlertBoxClosed=2023-05-12T07:53:26.343Z; _gcl_au=1.1.991363464.1701992878; _ga_Q149DFWHT7=GS1.1.1706837786.2.0.1706837789.0.0.0; OptanonConsent=isIABGlobal=false&datestamp=Fri+Feb+02+2024+05%3A40%3A35+GMT%2B0330+(Iran+Standard+Time)&version=6.33.0&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1&geolocation=PL%3B22&AwaitingReconsent=false; _ga=GA1.2.774637880.1701992878; _ga_YL03HBJY7E=GS1.1.1706839836.2.1.1706839865.0.0.0; cf_clearance=FY2HaT9QJjs9n8hPAp1K6zvWkIMO6aANjb.p6PRt0I8-1707169787-1-AXBP7lkJOSYw5qHa3y4k65F3zdR05WYyLjdGM+ahye385ttMJnYH3YJiuiGGIxLSgjcjwldV4GfxVN5ns/2T3Fw=; __cfruid=083c358436f60bb1574b600eb6d9c59b4fb530ae-1707169787; _cfuvid=bOxW4bZ9NCX.YjQyXtkx7lCjj90DaBBRfBDwIvd01LU-1707169787245-0-604800000',
        'Origin': 'https://discord.com',
        'Referer': 'https://discord.com/channels/691340129981300750/691340129981300753',
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
        
    }

    constructor(app) {
        this.app = app
        this.checkQuee()
    }

    async checkQuee() {
        await this.app.db.discordUploadQuee.findFirst({
            where: { isUploading: false }
        })
        .then(res => {
            if (res) this.upload(res)
        })
        .catch(err => {
            console.log('[discord@checkQuee]: ', err?.response)
        })
    }

    async upload({ id, fileName, fileSize }) {
        const { data: uploadInfo } = await axios.post(`${process.env.DISCORD_API_URL}/channels/${process.env.DISCORD_USER_UPLOAD_CHANNEL_ID}/attachments`, {
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
            console.log('[discord@upload:post]', err?.response?.data)
            throw new Error()
        })

        const fileBuffer = fs.readFileSync('./downloads/file_0.mp4')
        console.log('kos');
        
        await axios.put(uploadInfo.attachments[0].upload_url, fileBuffer, { headers: { 'Content-Type': 'application/octet-stream' }})
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }
}