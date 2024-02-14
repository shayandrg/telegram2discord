// import { Telegraf } from 'telegraf'
// import { message } from 'telegraf/filters'
import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { StringSession } from "telegram/sessions";
import input from "input";
const Downloader = require('nodejs-file-downloader');

export default class Telegram {
    app = null
    client = null
    downloadQueue = []
    isDownloading = false

    constructor(app) {
        this.app = app
        // this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
        this.boot()
    }

    // boot() {
        // this.bot.on(message('video'), async (ctx) => {
        //     const fileLink = await ctx.telegram.getFileLink(ctx.message.video.file_id)          
        //     console.log(ctx.message);
            
        //     // return;
        //     const downloader = new Downloader({ url: fileLink.href, directory: './downloads', fileName: `${ctx.message.video.file_unique_id}.mp4` })
        //     await downloader.download()
        //     .catch(err => {
        //         console.log(err);
        //     })

        //     await this.app.db.discordUploadQueue.create({
        //         data: {
        //             fileName: ctx.message.video.file_unique_id,
        //             fileSize: ctx.message.video.file_size
        //         }
        //     })

        //     this.app.discord.runUploadQueue()
        // })
    // }

    async boot() {
        const stringSession = new StringSession(process.env.TELEGRAM_CLIENT_SESSION)

        this.client = new TelegramClient(stringSession, Number(process.env.TELEGRAM_API_ID), process.env.TELEGRAM_API_HASH, {
            connectionRetries: 2,
            requestRetries: 2,
            autoReconnect: true,
            useWSS: false, // Important. Most proxies cannot use SSL.
            proxy: {
                ip: process.env.LOCALHOST, // Proxy host (IP or hostname)
                port: Number(process.env.PROXY_PORT), // Proxy port
                MTProxy: false, // Whether it's an MTProxy or a normal Socks one
                secret: "00000000000000000000000000000000", // If used MTProxy then you need to provide a secret (or zeros).
                socksType: 5, // If used Socks you can choose 4 or 5.
                timeout: 2, // Timeout (in seconds) for connection,
            },
        })

        await this.client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () =>
                await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        })
        this.client.session.save()

        this.client.addEventHandler((event: NewMessageEvent) => {
            // @ts-ignore
            if (event.message?.media?.document.mimeType == 'video/mp4' && Number(event.message?.media?.document.size.value) < 499000000) {
                this.downloadQueue.push(event.message)
                this.runDownloadQueue()
            }
        }, new NewMessage({}))
    }

    async runDownloadQueue() {
        if (!this.isDownloading && this.downloadQueue[0]) {
            console.log('start downloading');
            
            this.isDownloading = true
            let message = this.downloadQueue[0];
            if (message) {
                const fileName = `${Math.floor(Math.random()*90000) + 10000}.mp4`;
                await message.downloadMedia({ outputFile: `./downloads/${fileName}` })
                .then(res => {
                    this.app.db.discordUploadQueue.create({
                        data: {
                            fileName,
                            fileSize: Number(message.media?.document?.size?.value ?? 0)
                        }
                    })
                    .then(res => {
                        this.app.discord.runUploadQueue()
                    })
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.downloadQueue.shift()
                    this.isDownloading = false
                    this.runDownloadQueue()
                })
            }
            console.log('finish downloading');
        }
    }
}