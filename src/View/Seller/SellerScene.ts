import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./SellerGreeting";
require("dotenv").config();

const handler = new Composer<MyContext>(); // function
const seller = new Scenes.WizardScene(
    "seller",
    handler,
)

handler.action('openDeal', async (ctx) => {
    ctx.reply('Открытие сделки ')
})

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.enter(async (ctx) => await greeting(ctx))
export default seller