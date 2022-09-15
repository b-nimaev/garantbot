import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./DealGreeting";
require("dotenv").config();

async function setRole(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {
        if (data == 'seller' || data == 'buyer') {
            ctx.answerCbQuery('Role setted')
            UserService.SetRole(ctx)
        }

    }
}

const handler = new Composer<MyContext>(); // function
const deal = new Scenes.WizardScene(
    "deal",
    handler,
)

handler.action('openDeal', async (ctx) => {
    ctx.reply('Открытие сделки ')
})

deal.leave(async (ctx) => console.log("deal scene leave"))
deal.enter(async (ctx) => await greeting(ctx))
export default deal