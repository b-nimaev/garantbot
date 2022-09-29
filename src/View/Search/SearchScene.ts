import { Composer, Scenes } from "telegraf";
// import * as EmailValidator from 'email-validator';
import { MyContext } from "../../Model/Model";
import { greeting } from "./SearchGreeting";
require("dotenv").config();


const handler = new Composer<MyContext>(); // function
const search = new Scenes.WizardScene(
    "search",
    handler,
)

search.leave(async (ctx) => console.log("search scene leave"))
search.enter(async (ctx) => await greeting(ctx))
export default search