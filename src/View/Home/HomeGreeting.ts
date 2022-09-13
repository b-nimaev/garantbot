import { getUser, registerUser, removeBalance, getInterface } from "../../Controller/UserController"
import { MyContext } from "../../Model/Model"
// import { messageRenderFunction } from "./HomeScene"

export async function greeting(ctx: MyContext) {

    if (ctx.update["message"]) {

        let user = ctx.update["message"].from

        if (user) {

            let userData = await getUser(user)

            if (!userData) {
                await registerUser(user)
            } else {
                await removeBalance(user)
            }

        }
    }

    let extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Продавец',
                        callback_data: 'seller'
                    },
                    {
                        text: 'Покупатель',
                        callback_data: 'buyer'
                    }
                ]
            ]
        }
    }

    // return await messageRenderFunction(ctx)

    const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
    await ctx.replyWithSticker("CAACAgUAAxkBAAIJ8GMdpBkf7apOsOKO5HMFXltRA6-7AAJoBgACkuQYVtOM4kdKF-ejKQQ")

    // @ts-ignore
    ctx.update["message"] ? await ctx.reply(message, extra) : await ctx.reply(message, extra)
    ctx.wizard.next()
}