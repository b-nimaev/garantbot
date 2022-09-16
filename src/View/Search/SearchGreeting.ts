import { Model, Schema } from "mongoose"
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        let user: IUser | null | undefined = await UserService.GetUserById(ctx)
        console.log(user)
        if (user) {
            let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>${user.role}</code> \nВаш e-mail: <code>${user.email}</code>\n`;

            message += `Дата регистрации: ${user.date.registered} \n\n`;
            message += `Чтобы остановить поиск можно нажать на кнопку ниже <b>Остановить поиск</b>, \n\n<b>или</b> отправить команду /stop_search \n\n`
            message += `... Идёт поиск 🔎`;

            const buyerExtraKeyboard: ExtraEditMessageText = {
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

            await ctx.editMessageText(message, buyerExtraKeyboard)
        }

    }
}