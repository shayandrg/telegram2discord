process.on('uncaughtException', err => console.error('Uncaught Exception:', err))

import 'dotenv/config'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import Telegram from './telegram'
import Discord from './discord'
import { SocksProxyAgent } from 'socks-proxy-agent'

const httpsAgent = new SocksProxyAgent(`socks5://host.docker.internal:${process.env.PROXY_PORT}`)

const app = {
    axios: axios.create({ httpsAgent, httpAgent: httpsAgent }),
    db: new PrismaClient(),
    telegram: null,
    discord: null
}

app.telegram = new Telegram(app)
app.discord = new Discord(app)