import { ObjectID } from "bson";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ADSModel, paginate, UserService } from "../../Controller/db";
import { MyContext } from "../../Model/Model";
import CustomerService, { AService } from "../Customer/CustomerServices";

export default class {

    static async greeting(ctx: MyContext) {
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
                    ctx.wizard.selectStep(0)
                    ctx.updateType == 'callback_query' ? await ctx.editMessageText(message, buyerExtraKeyboard) : await ctx.reply(message, buyerExtraKeyboard)
                }
    
            })
    
        }
    }

    static async get_ads(ctx: MyContext, active_page?: number) {
        try {
            let req = await ADSModel.find();

            if (req) {
                if (req.length > 0) {
                    let message = `<b>Найдено ${req.length}\n\n</b>`
                    let keyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    }

                    let page_size = 3
                    let page = 1
                    let pages = req.length / page_size
                    let ads

                    if (active_page) {
                        message += `<b>Страница: ${active_page}</b>\n\n`
                    } else {
                        if (req.length / page_size > 1) {
                            let temp = req.length / page_size
                            message += `<b>Страница:</b> 1\n\n / ${Math.ceil(temp)}`
                        }
                    }


                    if (active_page) {
                        ads = await paginate(req, page_size, active_page)
                    } else {
                        ads = await paginate(req, page_size, 1)
                    }
                    ads.forEach(async (element, index) => {

                        if (element.crypto_currency[0]) {
                            if (element.crypto_currency[0].callback_data) {
                                // @ts-ignore
                                message += `<b>_id <code>${element._id}</code></b>\n`
                                message += `<b>Сумма: <code>${element.sum} ₽</code></b>\n`
                                message += `<b>Криптовалюта: ${element.crypto_currency[0].callback_data.toUpperCase()}</b>\n\n`

                            }
                        }
                    })

                    message += `📝 Отправьте _id объявлеиня для выбора`

                    let temp: InlineKeyboardButton[] = []
                    if (pages > 1) {
                        for (let i = 0; i < pages; i++) {
                            if ((i % 3 == 0) && (i !== 0)) {
                                temp.push({
                                    text: `${i}`,
                                    callback_data: `goto ${i}`
                                })
                                keyboard.reply_markup?.inline_keyboard.push(temp)
                                temp = []
                            }
    
                            else {
                                temp.push({
                                    text: `${i + 1}`,
                                    callback_data: `goto ${i}`
                                })
    
                            }
                        }
                    }

                    if (temp.length > 0) {
                        keyboard.reply_markup?.inline_keyboard.push(temp)
                    }

                    keyboard.reply_markup?.inline_keyboard.push([{
                        text: 'На главную',
                        callback_data: 'to_home'
                    }])

                    try {
                        if (ctx.updateType == 'callback_query') {
                            await ctx.editMessageText(message, keyboard)
                        }
                        
                        if (ctx.updateType == 'message') {
                            await ctx.reply(message, keyboard)
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(document.ads)

                } else {

                    if (ctx.update["callback_query"].data == 'delete') {
                        return await CustomerService.greeting(ctx)
                    }

                    ctx.answerCbQuery("Объявлений не найдено!")
                    ctx.wizard.selectStep(0)
                }
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async handler(ctx: MyContext) {

        if (ctx.updateType == 'message') {
            let message = ctx.update["message"].text
            await AService.get_created_ads(new ObjectID(message)).then(async (document) => {
                if (document) {
                    await this.single_ads(ctx, document)
                }
            })
        }

        if (ctx.updateType == 'callback_query') {
            let callback_data = ctx.update["callback_query"].data
            if (callback_data == 'to_home') {
                await this.greeting(ctx)
            }
        }
    }

    static async single_ads(ctx: MyContext, data) {
        ctx.wizard.selectStep(2)
        let message = `Объявление <code>${data._id}</code>\n\n`
        message += `Количество откликов: ${data.responses.length}\n`
        message += `Cумма: ${data.sum} ₽\n`
        message += `Дата публикации: ${data.date}\n`
        message += `Способы оплаты: `
        data.payment_method.forEach(async (user_payment_method, index) => {
            if (data.payment_method.length == index + 1) {
                message += `${user_payment_method.text}\n`
            } else {
                message += `${user_payment_method.text}, `
            }
        })

        message += `Банки и платежные системы: `
        data.banks.forEach(async (user_payment_method, index) => {
            if (data.banks.length == index + 1) {
                message += `${user_payment_method.text}`
            } else {
                message += `${user_payment_method.text}, `
            }
        })

        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Отликнуться',
                            callback_data: 'response'
                        }
                    ],
                    [
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        }

        try {
            if (ctx.updateType == 'message') {
                await ctx.reply(message, extra)
            }

            if (ctx.updateType == 'callback_query') {
                await ctx.editMessageText(message, extra)
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async single_ads_handler(ctx: MyContext) {
        if (ctx.updateType == 'callback_query') {
            let callback_data = ctx.update["callback_query"].data

            if (callback_data == 'reponse') {
                //
            }

            if (callback_data == 'back') {
                await ctx.wizard.selectStep(1)
                await this.get_ads(ctx)
            }

        }
    }

}