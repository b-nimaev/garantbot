import { Model, Schema } from "mongoose"
import { ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"
// import { messageRenderFunction } from "./HomeScene"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        let user: IUser | null | undefined = await UserService.GetUserById(ctx)

        if (user) {

            let message: string 

            // Если пользователь существует в базе данных
            if (user.role == 'buyer') {
                return await ctx.scene.enter("customer")
            }

            if (user.role == 'seller') {
                return await ctx.scene.enter('seller')
            }

        } else {

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
                                callback_data: 'buyer'
                            }
                        ]
                    ]
                }
            }

            // Если пользователя нет в базе данных
            await UserService.SaveUser(ctx)

            const message = `Привет, ${ctx.from?.first_name}, выбери свою роль 🗡`
            // @ts-ignore
            ctx.update["message"] ? await ctx.reply(message, extra) : await ctx.reply(message, extra)
        }
    }

    ctx.wizard.next()
}