import { ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        let user: IUser | null | undefined = await UserService.GetUserById(ctx)
        if (user) {
            let message = `Ваш ID: <code>${user.id}</code> \nРоль: Продавец \nВаш e-mail: <code>${user.email}</code> \nДата регистрации: ${user.date.registered} \n\nЧтобы начать работу, нажмите на кнопку ниже <b>Найти сделку</b>`

            const buyerExtraKeyboard: ExtraReplyMessage = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Найти сделку',
                                callback_data: 'searchDeal'
                            }
                        ]
                    ]
                }
            }

            await ctx.reply(message, buyerExtraKeyboard)
        }

    }
}