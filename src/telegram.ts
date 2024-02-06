import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
const Downloader = require('nodejs-file-downloader');

export default class Telegram {
    app = null
    bot = null

    constructor(app) {
        this.app = app
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
        this.boot()
    }

    boot() {
        this.bot.on(message('video'), async (ctx) => {
            const fileLink = await ctx.telegram.getFileLink(ctx.message.video.file_id)          

            const downloader = new Downloader({ url: fileLink.href, directory: './downloads', fileName: `${ctx.message.video.file_unique_id}.mp4` })
            await downloader.download()
            .catch(err => {
                console.log(err);
            })

            await this.app.db.discordUploadQuee.create({
                data: {
                    fileName: ctx.message.video.file_unique_id,
                    fileSize: ctx.message.video.file_size
                }
            })

            this.app.discord.checkQuee()
        })
    }
}