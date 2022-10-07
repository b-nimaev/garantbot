import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./HomeGreeting";
require("dotenv").config();


const handler = new Composer<MyContext>(); // function
const home = new Scenes.WizardScene(
    "home",
    handler
)

home.action('seller', async (ctx) => {
    return await UserService.SetRole(ctx)
})
home.action('customer', async (ctx) => {
    return await UserService.SetRole(ctx)
})


home.leave(async (ctx) => console.log("home leave"))
home.start(async (ctx) => await greeting(ctx))
home.enter(async (ctx) => {
    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Продавец',
                        callback_data: 'seller'
                    },
                    {
                        text: 'Покупатель',
                        callback_data: 'customer'
                    }
                ]
            ]
        }
    }

    try {

        if (ctx.from) {
            const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`

            // @ts-ignore
            ctx.update["message"] ? await ctx.reply(message, extra) : await ctx.editMessageText(message, extra)

        }

        // ctx.wizard.next()

    } catch (err) {
        const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
        // @ts-ignore
        await ctx.reply(message, extra)
    }
})
export default home                                                                                                 