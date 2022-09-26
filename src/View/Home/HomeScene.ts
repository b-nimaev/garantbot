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

handler.action('seller', async (ctx) => await ctx.scene.enter("seller"))
handler.action('buyer', async (ctx) => await ctx.scene.enter("customer"))

home.action('seller', async (ctx) => await ctx.scene.enter("seller"))
home.action('buyer', async (ctx) => await ctx.scene.enter("customer"))


home.leave(async (ctx) => console.log("home leave"))
home.start(async (ctx) => await greeting(ctx))
home.enter(async (ctx) => await greeting(ctx))
export default home                                                                                                 