import { Model, Schema } from "mongoose"
import { ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"
// import { messageRenderFunction } from "./HomeScene"

export async function greeting(ctx: MyContext) {

    const extra = {
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
                        callback_data: 'customer'
                    }
                ]
            ]
        }
    }

    try {

        if (ctx.from) {
            await UserService.GetUserById(ctx).then(async (user) => {
                if (user) {
                    if (user.role == 'customer' || user.role == 'seller') {
                        user.role == 'customer' ? await ctx.scene.enter("customer") : false
                        user.role == 'seller' ? await ctx.scene.enter("seller") : false
                    } else {
                        const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
                 
                        // @ts-ignore
                        ctx.update["message"] ? await ctx.reply(message, extra) : await ctx.editMessageText(message, extra)
                    }
                } else {
                    await UserService.SaveUser(ctx)    
    
                    const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
                 
                    // @ts-ignore
                    ctx.update["message"] ? await ctx.reply(message, extra) : await ctx.editMessageText(message, extra)
                }
            })
    
        }
    
        // ctx.wizard.next()

    } catch (err) {
        const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
        // @ts-ignore
        await ctx.reply(message, extra)
    }
}