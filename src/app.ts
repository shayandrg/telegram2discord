import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import Telegram from './telegram'
import Discord from './discord'

const app = {
    db: new PrismaClient(),
    telegram: null,
    discord: null
}

app.telegram = new Telegram(app)
app.discord = new Discord(app)

app.telegram.launch()
process.once('SIGINT', () => app.telegram.stop('SIGINT'))
process.once('SIGTERM', () => app.telegram.stop('SIGTERM'))