import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
require("dotenv").config()

const handler = new Composer<MyContext>();
const admin = new Scenes.WizardScene(
    "admin",
    handler,
);

admin.action("home", async (ctx) => {
    ctx.scene.enter("home")
    ctx.answerCbQuery()
})

handler.action("contact", async (ctx) => {
    ctx.wizard.next()
    ctx.editMessageText("Отправьте сообщение, администрация ответит в ближайшее время")
    ctx.answerCbQuery()
})

handler.on("message", async (ctx) => {
    console.log(ctx.message)
})

export default admin