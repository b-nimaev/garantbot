import { Model, Schema } from "mongoose"
import { ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        let user: IUser | null | undefined = await UserService.GetUserById(ctx)
        console.log(user)
        if (user) {
            let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>Продавец</code> \nВаш e-mail: <code>${user.email}</code> \nДата регистрации: ${user.date.registered} \n\nЧтобы начать работу, нажмите на кнопку ниже <b>Открыть сделку</b>`

            const buyerExtraKeyboard: ExtraReplyMessage = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Открыть сделку',
                                callback_data: 'openDeal'
                            }
                        ]
                    ]
                }
            }

            await ctx.reply(message, buyerExtraKeyboard)
        }

    }
}