import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { UserService } from "../../Controller/db";
import CurrencyService from "../../Controller/Services/Currecny.Services";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./SellerGreeting";
require("dotenv").config();

const currency = ['usd', 'rub', 'byn', 'euro', 'kzt']

async function renderSelectCurrency(ctx: MyContext) {
    let currencies = await CurrencyService.GetAllCurrencies()
    console.log(currencies)
}

async function selectCurrency(ctx: MyContext) {
    if (ctx.updateType == 'callback_query') {
        await renderSelectCurrency(ctx)
        ctx.answerCbQuery()
    }
}

const handler = new Composer<MyContext>(); // function
const seller = new Scenes.WizardScene(
    "seller",
    handler,
    async (ctx) => await selectCurrency(ctx)
)

handler.action('openDeal', async (ctx) => {
    
    try {
        let sellerExtraKeyboard: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [

                ]
            }
        }


        currency.forEach(async (element) => {
            sellerExtraKeyboard.reply_markup?.inline_keyboard.push([{
                text: element,
                callback_data: element
            }])
        })
    
        await ctx.editMessageText('Выберите валюту в которой будете покупать крипту', sellerExtraKeyboard)
    
        ctx.wizard.next()
    } catch (err) {
        ctx.scene.enter('home')
    }

})

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.enter(async (ctx) => await greeting(ctx))
export default seller