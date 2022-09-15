import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
import { MyContext } from "../../Model/Model";
import { greeting } from "./SellerGreeting";
require("dotenv").config();

async function searchDeal(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {
        if (data == 'searchDeal') {
            // UserService.SetRole(ctx)

            ctx.reply('Поиск сделок ...')

        }
    }
}

const handler = new Composer<MyContext>(); // function
const seller = new Scenes.WizardScene(
    "seller",
    handler,
    async (ctx) => searchDeal(ctx),
)

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.start(async (ctx) => await greeting(ctx))
export default seller