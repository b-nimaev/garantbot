import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { renderSearchD } from "../Customer/CustomerScene";
import { greeting } from "./SearchGreeting";
require("dotenv").config();

async function stopSearch(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data
    ctx.answerCbQuery()

    if (query) {
        if (data == 'stop_search') {
            await ctx.scene.enter('home')
            await renderSearchD(ctx)
        }
    }

}

const handler = new Composer<MyContext>(); // function
const search = new Scenes.WizardScene(
    "search",
    handler,
    async (ctx) => await stopSearch(ctx)
)

handler.action('stop_search', async (ctx) => await stopSearch(ctx))

search.leave(async (ctx) => console.log("search scene leave"))
search.enter(async (ctx) => await greeting(ctx))
export default search