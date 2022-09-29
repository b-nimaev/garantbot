import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ContextService } from "../../Controller/Context";
import { IUser, UserService } from "../../Controller/db";
import CurrencyService, { CryptoCurrencyModel } from "../../Controller/Services/Currecny.Services";
import { MyContext } from "../../Model/Model";
import ICurrency from "../../Model/Services.Currency.Model";

async function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export default class CustomerService {
    static async main(ctx: MyContext) {
        if (ctx.updateType == "callback_query") {

            let callback_data = ctx.update["callback_query"].data
            let user = await UserService.GetUserById(ctx)

            // Создать объявление
            if (callback_data == 'create') {
                if (user?.settings.banks.length == 0) {
                    return await this.UserBanksRender(ctx)
                }

                return await this.UserBanksRender(ctx)
            }

            ctx.answerCbQuery()
        }
    }

    static async greeting(ctx: MyContext) {
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
            
                        ctx.wizard.selectStep(1)
                        ctx.update['callback_query'] ? ctx.answerCbQuery() : true;
                        ctx.update['callback_query'] ? await ctx.editMessageText(message, buyerExtraKeyboard) : await ctx.reply(message, buyerExtraKeyboard)
                    }
    
                })
    
        }   
    }

    static async UserBanksRender(ctx: MyContext) {
        try {

            let message = `Выберите банк`


            let user = await UserService.GetUserById(ctx)

            // @ts-ignore
            for (let i = 0; i < user.settings.banks.length; i++) {
                // @ts-ignore
                message += `\n${i + 1}. ${user.settings.banks[i].text}`
            }

            // Получаем все банки
            let banks: { text: string, callback_data: string }[] = await UserService.GetBanks()
            let temp: InlineKeyboardButton[] = []

            let keyboard = await this.renderSelectBankKeyboard(ctx)
            if (keyboard) {
                await ctx.editMessageText(message, keyboard)
                ctx.wizard.next()
            } else {
                ctx.scene.enter('home')
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async selectBank(ctx: MyContext) {
        try {
            if (ctx.updateType == 'callback_query') {
                let query = ctx.update['callback_query']

                if (query.data == 'continue') {
                    return await this.choosePaymentMethod(ctx)
                    // return await CCurrencies.render(ctx)
                }

                let data = query.data.split(' ')
                let banks: { text: string, callback_data: string }[] = await UserService.GetBanks()
                console.log(data)
                if (query) {
                    if (data && banks.length > 0) {
                        if (data[0] !== 'remove_bank') {
                            banks.forEach(async (element: { text: string, callback_data: string }) => {
                                if (element.callback_data == data[0]) {
                                    await UserService.SetBank(ctx, element)
                                        .then(async res => { await this.rerenderAfterSelectBank(ctx) })
                                        .catch((err) => { console.log(err) })
                                }
                            })
                        } else {
                            banks.forEach(async (element: { text: string, callback_data: string }) => {
                                if (element.callback_data == data[1]) {
                                    await this.spliceBankFromSettings(ctx, element).then(async () => {
                                        await this.rerenderAfterSelectBank(ctx)
                                    })
                                }

                            })
                        }
                    }
                }

                ctx.answerCbQuery()
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async choosePaymentMethod(ctx: MyContext) {

        let message = `Выберите способ оплаты`
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: []
            }
        }
        
        

        await ctx.editMessageText(message, extra)
    }

    static async rerenderAfterSelectBank(ctx: MyContext) {
        try {
            let user: IUser | null | false | undefined = await UserService.GetUserById(ctx)

            if (user) {
                let message = `Выберите банк`

                // @ts-ignore
                for (let i = 0; i < user.settings.banks.length; i++) {
                    // @ts-ignore
                    message += `\n${i + 1}. ${user.settings.banks[i].text}`
                }

                let keyboard = await this.renderSelectBankKeyboard(ctx)
                if (keyboard) {
                    await ctx.editMessageText(message, keyboard)
                    // ctx.wizard.next()
                } else {
                    ctx.scene.enter('home')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async spliceBankFromSettings(ctx: MyContext, field: { text: string, callback_data: string }) {
        try {
            let user: IUser | null | false | undefined = await UserService.GetUserById(ctx)

            if (user) {
                return await UserService.SpliceBank(ctx, field)
                    .then(success => { return ctx.answerCbQuery('Элемент удален из базы данных') })
                    .catch(unsuccess => { return ctx.answerCbQuery('Не получилось удалить') })

                // return this.rerenderAfterSelectBank(ctx)
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async renderSelectBankKeyboard(ctx: MyContext) {

        let searchDealKeyboard: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: []
            }
        }

        try {
            let user: IUser | null | false | undefined = await UserService.GetUserById(ctx)

            if (user) {
                let banks: { text: string, callback_data: string }[] = await UserService.GetBanks()

                let temp: InlineKeyboardButton[] = []

                banks.forEach(async (element: { text: string; callback_data: string }, index: number) => {


                    // Получаем банки пользователя
                    // @ts-ignore
                    let userBanks = user.settings.banks;
                    // console.log(element)
                    if (userBanks) {

                        userBanks.forEach(async (item) => {
                            let tempvar = '❌ ' + item.text
                            if ((item.callback_data === element.callback_data) && (tempvar !== item.text)) {
                                element.text = '❌ ' + element.text
                                element.callback_data = 'remove_bank ' + element.callback_data
                            }
                        })
                        temp.push(element)

                    }

                    if (index % 2 == 1) {
                        searchDealKeyboard.reply_markup?.inline_keyboard.push(temp)
                        temp = []
                    }
                })

                if (user.settings.banks.length > 0) {
                    searchDealKeyboard.reply_markup?.inline_keyboard.push([
                        {
                            text: 'Продолжить',
                            callback_data: 'continue'
                        }
                    ])
                }

                return searchDealKeyboard
            } else {
                return ctx.scene.enter('home')
            }

        } catch (err) {
            console.log(err)
            return searchDealKeyboard
        }
    }

}

export class SumService {
    static async checkSum(ctx: MyContext) {
        if (ctx.updateType == 'message') {
            let message = ctx.update["message"].text

            const extra: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Подтвердить',
                                callback_data: 'continue'
                            },
                            {
                                text: 'На главную',
                                callback_data: 'back'
                            }
                        ]
                    ]
                }
            }

            if (parseFloat(message) > 0) {
                await UserService.SaveSum(ctx, parseFloat(message))
                let user = await UserService.GetUserById(ctx)
                if (user) {
                    if (user.settings.crypto_currency) {
                        let money = parseFloat(message)
                        let message_result = `<b>Приобрести <i>${user?.settings.crypto_currency[0].callback_data.toUpperCase()} на ${money} ₽</i></b>`
                        message_result += `\n<b>Банки и Платежные системы: </b>`
                        user.settings.banks.forEach(async (item, index) => {
                            // @ts-ignore
                            if (index == user.settings.banks.length - 1) {
                                message_result += `${item.text}`
                            } else {
                                message_result += `${item.text}, `
                            }

                        })
                        await ctx.reply(message_result, extra)
                    }
                }
            } else {
                ctx.reply('Укажите сумму!')
            }

        }

        if (ctx.updateType == 'callback_query') {

            let data = ctx.update["callback_query"].data

            if (data == 'continue') {
                // await createAndRenderAds(ctx)
                return await AService.render(ctx)

            }

            if (data == 'my_ads') {
                await AService.get_ads(ctx)
                ctx.answerCbQuery('Мои объявления...')
            }

            if (data == 'back') {
                console.log('to home')
                await CustomerService.greeting(ctx)
            }
        }
    }
}

export class CCurrencies {
    static async render(ctx: MyContext) {
        // return createAndRenderAds(ctx)

        let crypto_currency = await this.GC(ctx)
        let user = await UserService.GetUserById(ctx)

        let message = `Укажите криптовалюту которую хотите приобрести`
        let renderSelectCurrencyKeyboard: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: []
            }
        }

        if (user) {
            if (user.settings) {
                let temp: InlineKeyboardButton[] = []
                crypto_currency.forEach((currency: ICurrency, index) => {

                    temp.push(currency.element)
                    if (index % 2 == 1) {
                        renderSelectCurrencyKeyboard.reply_markup?.inline_keyboard.push(temp)
                        temp = []
                    }

                });
            }
        }
        await ctx.editMessageText(message, renderSelectCurrencyKeyboard)
        ctx.wizard.selectStep(5)
    }

    static async handler(ctx: MyContext) {
        if (ctx.updateType == 'callback_query') {
            let data = ctx.update["callback_query"].data
            let arr = await this.GC(ctx)
            arr.forEach(async (currency) => {
                if (currency.element.callback_data == data) {
                    await UserService.SetCryptoCurrency(ctx, currency.element)
                        .then(async () => {
                            await this.amount_render(ctx)
                        })
                }
            })
            await ctx.answerCbQuery(data + ' выбран')
        }
    }

    static async amount_render(ctx: MyContext) {
        try {
            await UserService.GetUserById(ctx)
                .then(async (user) => {

                    if (user) {
                        // await UserService.CreateAds(ctx, user)

                        if (user.settings.crypto_currency) {
                            let message = `Отправьте сумму в рублях, на которую хотите приобрести ${user.settings.crypto_currency[0].text.toUpperCase()}`
                            await ctx.editMessageText(message)
                            ctx.wizard.selectStep(4)
                        }
                    }

                })

        } catch (err) {
            console.log(err)
            return false
        }
    }

    static async GC(ctx: MyContext) {
        try {

            return await CryptoCurrencyModel.find()

        } catch (err) {
            console.log(err)
            return []
        }
    }
}

export class AService {
    static async render(ctx: MyContext) {
        return await UserService.GetUserById(ctx)
            .then(async (document) => {
                if (document) {
                    await UserService.CreateAds(ctx, document)
                        .then(async (created_document) => {
                            let message = `<b>Объявление опубликовано!</b>\n`
                            message += `<b>Объём сделки: ${created_document.sum} ₽</b>\n`
                            message += `<b>Криптовалюта: ${created_document.crypto_currency[0].text.toUpperCase()}</b>`
                            message += `\n<b>Идентификатор: </b><code>${created_document._id}</code>`

                            const keyboard: ExtraEditMessageText = {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Мои объявления',
                                                callback_data: 'my_ads'
                                            },
                                            {
                                                text: 'На главную',
                                                callback_data: 'to_home'
                                            }
                                        ]
                                    ]
                                }
                            }

                            // @ts-ignore
                            await ctx.editMessageText(message, keyboard)
                            await ctx.answerCbQuery("Объявление сохранено")
                        })
                }
            })
    }

    static async get_ads(ctx: MyContext) {
        await UserService.GetUserById(ctx).then(async (document) => {
            if (document) {
                if (document.ads) {

                    let message = ``
                    const keyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'На главную',
                                        callback_data: 'to_home'
                                    }
                                ]
                            ]
                        }
                    }

                    console.log(document.ads)

                    const ads = await paginate(document.ads, 2, 1)
                    console.log(ads)
                    ads.forEach(async (element, index) => {

                        if (element.crypto_currency[0]) {
                            if (element.crypto_currency[0].callback_data) {
                                // @ts-ignore
                                message += `<b>_id <code>${element._id}</code></b>\n`
                                message += `<b>Сумма: <code>${element.sum} ${element.crypto_currency[0].callback_data.toUpperCase()}</code></b>\n`
                                message += `<b>Валюта для оплаты: </b>`

                                element.currency.forEach(async (cur_element, index) => {
                                    if (index == element.currency.length - 1) {
                                        message += `<code>${cur_element.callback_data.toUpperCase()}</code>\n\n`
                                    } else {
                                        message += `<code>${cur_element.callback_data.toUpperCase()}</code>, `
                                    }
                                })

                            }
                        }
                    })

                    try {
                        await ctx.editMessageText(message, keyboard)
                    } catch (err) {
                        console.log(err)
                    }
                    // console.log(document.ads)
                }
            }
        })
    }
}