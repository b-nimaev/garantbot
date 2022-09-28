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
home.enter(async (ctx) => await greeting(ctx))
export default home                                                                                                 