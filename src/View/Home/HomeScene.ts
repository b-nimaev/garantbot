import { Composer, Scenes } from "telegraf";
import { UserService } from "../../Controller/db";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./HomeGreeting";
require("dotenv").config();

async function setRole(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data
    
    if (query) {
        if (data == 'seller' || data == 'buyer') {
            UserService.SetRole(ctx)

            if (data == 'seller') {
                ctx.scene.enter('seller')
            }

            if (data == 'buyer') {
                ctx.scene.enter('customer')
            }
        }
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
home.enter(async (ctx) => await greeting(ctx))
export default home                                                                                                 