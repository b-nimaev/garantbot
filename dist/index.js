"use strict";
exports.__esModule = true;
exports.currency = void 0;
/* eslint-disable @typescript-eslint/no-floating-promises */
var telegraf_1 = require("telegraf");
// Scenes
var HomeScene_1 = require("./View/Home/HomeScene");
var SellerScene_1 = require("./View/Seller/SellerScene");
var CustomerScene_1 = require("./View/Customer/CustomerScene");
var SearchScene_1 = require("./View/Search/SearchScene");
var ChangeSearchParamsScene_1 = require("./View/ChangeSearchParams/ChangeSearchParamsScene");
// SSL
var fs = require('fs');
var key = fs.readFileSync('./ssl/localhost.decrypted.key');
var cert = fs.readFileSync('./ssl/localhost.crt');
var https = require('https');
var morgan = require("morgan");
var cors = require("cors");
var BodyParser = require("body-parser");
exports.currency = [{
        text: 'BTC',
        callback_data: 'btc'
    }, {
        text: 'USDT',
        callback_data: 'usdt'
    }];
// Server
require("dotenv").config();
var express = require("express");
// Bot token check
var token = process.env.token;
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!');
}
// Init scenes & set secretPath for requires from bot
var scenes = [HomeScene_1["default"], SellerScene_1["default"], CustomerScene_1["default"], SearchScene_1["default"], ChangeSearchParamsScene_1["default"]];
var bot = new telegraf_1.Telegraf(token);
exports["default"] = bot;
var app = express();
var port = process.env.port;
var secretPath = "/telegraf/".concat(bot.secretPathComponent());
var stage = new telegraf_1.Scenes.Stage(scenes, {
    "default": 'home'
});
// Set webhook
if (process.env.mode === "development") {
    var fetch_1 = require('node-fetch');
    fetch_1('http://localhost:4040/api/tunnels')
        .then(function (res) { return res.json(); })
        .then(function (json) { return json.tunnels.find(function (tunnel) { return tunnel.proto === 'https'; }); })
        .then(function (secureTunnel) { return bot.telegram.setWebhook("".concat(secureTunnel.public_url).concat(secretPath)); })
        .then(function (status) { return console.log('Webhook setted: ' + status); })["catch"](function (err) {
        if (err.code === 'ECONNREFUSED') {
            return console.error("Looks like you're not running ngrok.");
        }
        console.error(err);
    });
}
else {
    bot.telegram.setWebhook("https://say-an.ru".concat(secretPath))
        .then(function (status) { return console.log('Webhook setted: ' + status); });
    console.log(secretPath);
}
bot.use((0, telegraf_1.session)());
bot.use(function (ctx, next) {
    var now = new Date();
    ctx.myContextProp = now.toString();
    // console.log(ctx)
    return next();
});
bot.use(stage.middleware());
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));
// bot.command("/start", async (ctx) => console.log('start'))
app.use(morgan("dev"));
// @ts-ignore
app.get("/", function (req, res) { return res.send("Бот запущен!"); });
app.use(bot.webhookCallback(secretPath));
var server = https.createServer({ key: key, cert: cert }, app);
server.listen(port, function () { return console.log("telegram bot launched!"); });
// Enable graceful stop
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
//# sourceMappingURL=index.js.map