import { Composer, Scenes } from "telegraf";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./HomeGreeting";
require("dotenv").config();

async function setRole(ctx: MyContext) {
    if (ctx.update['callback_query']) {

        if ((ctx.update['callback_query'].data == 'seller')) {
            ctx.editMessageText('Продавец')
        }

        if ((ctx.update['callback_query'].data == 'buyer')) {
            ctx.editMessageText('Покупатель')
        }

        ctx.answerCbQuery('Role setted')
    }
}

const handler = new Composer<MyContext>(); // function
const home = new Scenes.WizardScene(
    "home",
    handler,
    async (ctx) => setRole(ctx),
)

home.leave(async (ctx) => console.log("home leave"))
home.start(async (ctx) => await greeting(ctx))
export default home