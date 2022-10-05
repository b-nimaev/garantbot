import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
import SellerService from "./SellerService";
require("dotenv").config();


const handler = new Composer<MyContext>(); // function
const seller = new Scenes.WizardScene(
    "seller",
    handler,
    async (ctx) => await SellerService.handler(ctx),
    async (ctx) => await SellerService.single_ads_handler(ctx),
    async (ctx) => await SellerService.fetch_data_handler(ctx)
)

handler.action("search_deal", async (ctx) => {
    await SellerService.get_ads(ctx)
    ctx.wizard.next()
    ctx.answerCbQuery('Список объявлений получен!')
})

handler.action("my_responses", async (ctx) => {
    ctx.answerCbQuery('Мои отклики')
})

seller.leave(async (ctx) => console.log("seller scene leave"))
seller.enter(async (ctx) => await SellerService.greeting(ctx))
seller.start(async (ctx) => ctx.scene.enter("home"))
export default seller