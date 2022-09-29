import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { ContextService } from "../../Controller/Context"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        await UserService.GetUserById(ctx)
            .then(async (user) => {
                
                if (user) {
     
                    let date = await ContextService.GetFormattedTime(user.date.registered)

                    let message = `Ваш ID: <code>${user.id}</code>\n`
                        message += `Роль: <code>Покупатель</code>\n`
                        // message += `Ваш e-mail: <code>${user.email}</code>\n`
                        // message += `Дата регистрации: <code>${date}</code>\n\n`
                        // message += `Чтобы начать работу, нажмите на кнопку ниже <b>Найти сделку</b>`
        
                    let buyerExtraKeyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Создать объявление',
                                        callback_data: 'create'
                                    },
                                ],
                                [
                                    {
                                        text: 'Мои объявления',
                                        callback_data: 'my_ads'
                                    },
                                ]
                            ]
                        }
                    }
        
        
        
                    // [
                    //     {
                    //         text: 'Статистика',
                    //         callback_data: 'getStats'
                    //     }
                    // ], [
                    //     {
                    //         text: 'Написать в поддержку',
                    //         callback_data: 'support'
                    //     },
                    // ]
        
                    ctx.wizard.selectStep(1)
                    // ctx.wizard.next()
                    ctx.update['callback_query'] ? ctx.answerCbQuery() : true;
                    ctx.update['callback_query'] ? await ctx.editMessageText(message, buyerExtraKeyboard) : await ctx.reply(message, buyerExtraKeyboard)
                }

            })

    }
}