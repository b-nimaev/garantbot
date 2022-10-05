/* eslint-disable @typescript-eslint/no-floating-promises */
import { Markup, Scenes, session, Telegraf } from 'telegraf'
import { PaymentService, UserService } from './Controller/db';
import { MyContext } from './Model/Model'

// Scenes
import home from './View/Home/HomeScene';
import seller from './View/Seller/SellerScene';
import customer from './View/Customer/CustomerScene';
import search from './View/Search/SearchScene';
import chagneSearchParams from './View/ChangeSearchParams/ChangeSearchParamsScene';
import CurrencyService from './Controller/Services/Currecny.Services';
import { ContextService } from './Controller/Context';
import { ObjectId } from 'mongodb';

// SSL
const fs = require('fs');
const key = fs.readFileSync('./ssl/localhost.decrypted.key');
const cert = fs.readFileSync('./ssl/localhost.crt');
const https = require('https');

const morgan = require("morgan")
const cors = require("cors")
const BodyParser = require("body-parser")

// Server
require("dotenv").config()
const express = require("express")

// Bot token check
const token = process.env.token

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}


// Init scenes & set secretPath for requires from bot
const scenes = [home, seller, customer, search, chagneSearchParams]
const bot = new Telegraf<MyContext>(token)
bot.command('set_banks', async (ctx) => {
    try {
        await UserService.SetBanks().then((data) => {
            console.log(data)
        })
    } catch (err) {
        console.log(err)
    }
})

bot.command('set_crypto', async (ctx) => {
    try {
        await CurrencyService.SetCryptoCurrenciesArray().then(() => ctx.reply("Крипта записана!"))
    } catch (err) {
        console.log(err)
    }
})

bot.command('set_payments', async (ctx) => {
    try {
        await PaymentService.InsertPayments(ctx)
    } catch (err) {
        await ctx.reply("Что-то не так")
    }
})

bot.command('find', async (ctx) => {
    let id ='63354873bfd9635a1530e5c7'
    await UserService.FindDoc(id)
})

export default bot
const app = express()
const port = process.env.port
const secretPath = `/telegraf/${bot.secretPathComponent()}`
const stage = new Scenes.Stage<MyContext>(scenes, {
    default: 'home',
})

// Set webhook
if (process.env.mode === "development") {

    const fetch = require('node-fetch')
    fetch('http://localhost:4040/api/tunnels')
        .then(res => res.json())
        .then(json => json.tunnels.find(tunnel => tunnel.proto === 'https'))
        .then(secureTunnel => bot.telegram.setWebhook(`${secureTunnel.public_url}${secretPath}`))
        .then((status) => console.log('Webhook setted: ' + status))
        .catch(err => {
            if (err.code === 'ECONNREFUSED') {
                return console.error("Looks like you're not running ngrok.")
            }
            console.error(err)
        })
} else {
    bot.telegram.setWebhook(`https://anoname.xyz${secretPath}`)
        .then((status) => console.log('Webhook setted: ' + status))
    console.log(secretPath)
}

bot.use(session())
bot.use((ctx, next) => {
    const now = new Date()
    ctx.myContextProp = now.toString()
    // console.log(ctx)

    return next()
})
bot.use(stage.middleware())
app.use(cors());
app.use(BodyParser.json());
app.use(
    BodyParser.urlencoded({
        extended: true,
    })
);
// bot.command("/start", async (ctx) => console.log('start'))
app.use(morgan("dev"));

// @ts-ignore
app.get("/", (req: Request, res: Response) => res.send("Бот запущен!"))
app.use(bot.webhookCallback(secretPath))
const server = https.createServer({ key, cert }, app);
server.listen(port, () => console.log("telegram bot launched!"))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))