import { Model, Schema } from "mongoose"
import { ExtraEditMessageCaption, ExtraEditMessageLiveLocation, ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { IUser, UserService } from "../../Controller/db"
import { MyContext } from "../../Model/Model"

export async function greeting(ctx: MyContext) {

    if (ctx.from) {
        await UserService.GetUserById(ctx).then(async (user) => {

            if (user) {
                let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>Продавец</code>`
    
                const buyerExtraKeyboard: ExtraEditMessageText = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Найти сделку',
                                    callback_data: 'search_deal'
                                }
                            ]
                        ]
                    }
                }
    
                ctx.updateType == 'callback_query' ? await ctx.editMessageText(message, buyerExtraKeyboard) : await ctx.reply(message, buyerExtraKeyboard)
            }

        })

    }

}