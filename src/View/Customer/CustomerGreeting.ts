import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        let user: IUser | null | undefined = await UserService.GetUserById(ctx)
        if (user) {
            let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>Покупатель</code> \nВаш e-mail: <code>${user.email}</code> \nДата регистрации: ${user.date.registered} \n\nЧтобы начать работу, нажмите на кнопку ниже <b>Найти сделку</b>`

            const buyerExtraKeyboard: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Найти сделку',
                                callback_data: 'searchDeal'
                            },
                        ], [
                            {
                                text: 'Статистика',
                                callback_data: 'getStats'
                            }
                        ], [
                            {
                                text: 'Написать в поддержку',
                                callback_data: 'support'
                            },
                        ]
                    ]
                }
            }

            console.log('hey')
            ctx.wizard.selectStep(0)
            ctx.wizard.next()
            ctx.update['callback_query'] ? ctx.answerCbQuery() : true;
            ctx.update['callback_query'] ? await ctx.editMessageText(message, buyerExtraKeyboard) : await ctx.reply(message, buyerExtraKeyboard)
        } else {
            ctx.scene.enter('home')
        }

    }
}