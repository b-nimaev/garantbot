import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./ChangeSearchParamsGreeting";
require("dotenv").config();

const handler = new Composer<MyContext>(); // function
const chagneSearchParams = new Scenes.WizardScene(
    "chagneSearchParams",
    handler,
)

handler.action('openDeal', async (ctx) => {
    ctx.reply('Открытие сделки ')
})

chagneSearchParams.leave(async (ctx) => console.log("search scene leave"))
chagneSearchParams.enter(async (ctx) => await greeting(ctx))
export default chagneSearchParams