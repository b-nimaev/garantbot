import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { UserService } from "../../Controller/db";
import CurrencyService from "../../Controller/Services/Currecny.Services";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./SellerGreeting";
require("dotenv").config();

async function renderSelectCurrency(ctx: MyContext) {
    let currencies = await CurrencyService.GetAllCurrencies()
    console.log(ctx.update['callback_query'].data)
    return UserService.SetBuyerCurrencies(ctx)
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

handler.action(/./, async (ctx) => {
    if (ctx.updateType == 'callback_query') {
        await renderSelectCurrency(ctx)
        ctx.answerCbQuery()
    }
})

seller.action('openDeal', async (ctx) => {
    console.log('123')
    
    try {
        let sellerExtraKeyboard: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [

                ]
            }
        }

        let currency = await CurrencyService.GetAllCurrencies()
        // console.log(currency)
        currency.forEach(async (button) => {
            sellerExtraKeyboard.reply_markup?.inline_keyboard.push([button.element])
        })
    
        await ctx.editMessageText('Выберите валюту в которой будете покупать крипту', sellerExtraKeyboard)
    
        // ctx.wizard.next()
    } catch (err) {
        ctx.scene.enter('home')
    }

})

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.enter(async (ctx) => await greeting(ctx))
seller.start(async (ctx) => ctx.scene.enter("home"))
export default seller