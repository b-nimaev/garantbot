import { Composer, Scenes } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { UserService } from "../../Controller/db";
import CurrencyService from "../../Controller/Services/Currecny.Services";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import ICurrency from "../../Model/Services.Currency.Model";
import { greeting } from "./SellerGreeting";
require("dotenv").config();


const handler = new Composer<MyContext>(); // function
const seller = new Scenes.WizardScene(
    "seller",
    handler
)

handler.action("search_deal", async (ctx) => {
    ctx.answerCbQuery()
})

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.enter(async (ctx) => await greeting(ctx))
seller.start(async (ctx) => ctx.scene.enter("home"))
export default seller