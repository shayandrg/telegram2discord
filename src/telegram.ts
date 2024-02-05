import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
const Downloader = require("nodejs-file-downloader");

export default class Telegram {
    bot = null

    constructor(app) {
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
        this.boot()
    }

    boot() {
        this.bot.on(message('video'), async (ctx) => {
            const fileLink = await ctx.telegram.getFileLink(ctx.message.video.file_id)
            const downloader = new Downloader({ url: fileLink.href, directory: './downloads' })
            let filePath = null
            await downloader.download()
            .then(res => {
                filePath = res.filePath
                        // await this.app.db.discordUploadQuee.create({
                        //     data: {
                        //         fileName: 'file_0.mp4',
                        //         fileSize: 2653785
                        //     }
                        // })
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        })
    }
}