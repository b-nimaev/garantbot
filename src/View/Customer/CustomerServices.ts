import { ObjectId } from "mongodb";
import { callback } from "telegraf/typings/button";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { ContextService } from "../../Controller/Context";
import { ADSModel, IUser, PaymentService, UserModel, UserService } from "../../Controller/db";
import CurrencyService, { CryptoCurrencyModel } from "../../Controller/Services/Currecny.Services";
import { MyContext } from "../../Model/Model";
import ICurrency from "../../Model/Services.Currency.Model";

export async function paginate(array, page_size, page_number) {
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

            if (callback_data == 'my_ads') {
                ctx.wizard.selectStep(10)
                await UserService.get_ads(ctx)
            }

            if (callback_data == 'to_home') {
                await this.greeting(ctx)
                // await UserService.get_ads(ctx)
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
                    ctx.wizard.selectStep(6)
                    return await this.choosePaymentMethod(ctx)
                    // return await CCurrencies.render(ctx)
                }

                if (query.data == 'back') {
                    return await this.greeting(ctx)
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

        try {
            let methods = await PaymentService.GetPaymentMethods()

            if (methods) {
                if (methods.length !== 0) {
                    let message = `Выберите способ оплаты`
                    let extra: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    }

                    let user = await UserService.GetUserById(ctx)
                    let buttons: InlineKeyboardButton[] = []
                    methods.forEach(async (method) => {
                        if (user) {
                            let user_methods = user?.settings.payment_method

                            if (user_methods) {
                                if (user_methods.length > 0) {
                                    user_methods.forEach(async (user_method) => {
                                        let temp = user_method.text + ' (удалить)'

                                        if ((method.callback_data === user_method.callback_data)) {
                                            method.text += ' (удалить)'
                                            method.callback_data = 'remove_method ' + method.callback_data
                                        }


                                    })
                                }
                            }

                            extra.reply_markup?.inline_keyboard.push([method])

                        }
                    })

                    if (user) {
                        if (user.settings) {
                            if (user.settings.payment_method) {
                                if (user.settings.payment_method.length > 0) {
                                    extra.reply_markup?.inline_keyboard.push([
                                        {
                                            text: 'Продолжить',
                                            callback_data: 'continue'
                                        }
                                    ], [
                                        {
                                            text: 'Назад',
                                            callback_data: 'select_bank'
                                        }
                                    ])
                                }
                            }
                        }
                    }

                    return await ctx.editMessageText(message, extra)
                } else {
                    await ctx.reply('Нет доступных способов оплаты! \nОтправьте команду /set_payments')
                }
            }
        } catch (err) {
            console.log(err)
        }

    }

    static async choosePaymentMethodHandler(ctx: MyContext) {
        if (ctx.updateType == 'callback_query') {
            let callback_data = ctx.update["callback_query"].data

            if (callback_data == 'continue') {
                return this.crypto_wallets(ctx)
            }

            if (callback_data == 'select_bank') {
                ctx.wizard.selectStep(1)
                return this.UserBanksRender(ctx)
            }

            let splitted = callback_data.split(' ')
            let methods = await PaymentService.GetPaymentMethods()

            if (splitted[0] == 'remove_method') {
                methods.forEach(async (method) => {
                    if (method.callback_data == splitted[1]) {
                        await PaymentService.DeleteMethod(ctx, method)
                        return await this.choosePaymentMethod(ctx)
                    }
                })
            } else {
                methods.forEach(async (method) => {
                    if (method.callback_data == callback_data) {
                        await PaymentService.SaveMethod(ctx, method)
                        return await this.choosePaymentMethod(ctx)
                    }
                })
            }
        }
    }

    // Криптокошельки
    static async crypto_wallets(ctx: MyContext) {
        try {
            let user = await UserService.GetUserById(ctx)

            if (!user?.settings.crypto_address?.length) {
                let message = `Отправьте адрес криптокошелька`
                let extra: ExtraEditMessageText = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Назад',
                                    callback_data: 'banks'
                                }
                            ]
                        ]
                    }
                }
                ctx.wizard.selectStep(7)
                if (ctx.updateType == 'callback_query') {
                    await ctx.editMessageText(message, extra)
                } else {
                    await ctx.reply(message, extra)
                }
            } else {
                let message = `Выберите адрес криптокошелька`
                let extra: ExtraEditMessageText = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: []
                    }
                }

                user.settings.crypto_address.forEach(async (element, index) => {
                    message += `\n${index + 1}. <code>${element}</code>`
                    extra.reply_markup?.inline_keyboard.push([{
                        text: `${index + 1}`,
                        callback_data: `select_wallet ` + index
                    }])
                })

                extra.reply_markup?.inline_keyboard.push([{
                    text: 'Указать новый кошелёк',
                    callback_data: 'new_wallet'
                }])

                message += `\n\nЧтобы удалить кошелёк отправьте <code><b>/delete адрес_кошелька</b></code>`

                ctx.wizard.selectStep(8)
                await ctx.editMessageText(message, extra)
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async select_exists_wallet(ctx: MyContext) {
        try {

            console.log(ctx.updateType + ' clicked!')

            if (ctx.updateType == 'callback_query') {
                let callback_data = ctx.update["callback_query"].data

                if (callback_data == 'new_wallet') {
                    let message = `Отправьте адрес криптокошелька`
                    ctx.wizard.selectStep(7)
                    await ctx.editMessageText(message)
                }

                let split = callback_data.split(' ')
                if (split[0] == 'select_wallet') {
                    let index = split[1]
                    let user = await UserService.GetUserById(ctx)
                    if (user) {
                        if (user.settings.crypto_address?.length) {
                            user.settings.crypto_address.forEach(async (element, db_index) => {
                                if (index == db_index) {
                                    await UserService.PreSaveAddress(ctx, element)
                                    return await CCurrencies.amount_render(ctx)
                                    // return await ctx.editMessageText(`${element}  выбран!`)
                                }
                            })
                        }
                    }

                }

            }

            if (ctx.updateType == 'message') {
                let message = ctx.update["message"].text
                let data = message.split(' ')

                if (data[0] == '/delete') {
                    // ctx.reply(`${data[1]} удалён`)
                    await UserService.DeleteAddress(ctx, data[1]).then(async (result) => {
                        console.log(result)
                        await this.crypto_wallets(ctx)
                    })

                }

            }
        } catch (err) {
            console.log(err)
        }
    }

    static async after_select_wallet(ctx: MyContext) {
        try {

            let user = await UserService.GetUserById(ctx)
            if (user) {
                let message = `Проверка перед публикацией`
                message += `\nБанк: `
                user.settings.banks.forEach(async (user_bank, index) => {
                    if (user?.settings.banks.length == index + 1) {
                        message += `${user_bank.text}`
                    } else {
                        message += `${user_bank.text}, `
                    }
                })

                message += `\nСпособ оплаты: `
                user.settings.payment_method?.forEach(async (user_payment_method, index) => {
                    if (user?.settings.payment_method?.length == index + 1) {
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
                                    text: 'Опубликовать',
                                    callback_data: 'publicate'
                                }
                            ],
                            [
                                {
                                    text: 'На главную',
                                    callback_data: 'to_home'
                                }
                            ]
                        ]
                    }
                }

                ctx.editMessageText(message, extra)
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async check_wallet(ctx: MyContext) {
        if (ctx.updateType == 'message') {
            let wallet = ctx.update["message"].text
            await UserService.PreSaveAddress(ctx, wallet)
            const extra: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Правильно',
                                callback_data: 'continue'
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

            await ctx.reply(`Проверьте на правильность ввода адреса: <b>${wallet}</b>`, extra)
        }

        if (ctx.updateType == 'callback_query') {
            let data = ctx.update["callback_query"].data

            if (data == 'continue') {
                let user = await UserService.GetUserById(ctx)

                if (user) {
                    // if (user.settings.)
                }

                await UserService.SaveCryptoAddress(ctx)
                await CCurrencies.render(ctx)
                ctx.answerCbQuery('Кошелёк сохранён!')
            }

            if (data == 'back') {
                await this.crypto_wallets(ctx)
            }

            if (data == 'banks') {
                ctx.wizard.selectStep(6)
                await this.choosePaymentMethod(ctx)
            }

        }
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

                searchDealKeyboard.reply_markup?.inline_keyboard.push([
                    {
                        text: 'Назад',
                        callback_data: 'back'
                    }
                ])

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


                        message_result += `\n<b>Способ оплаты: </b>`
                        user.settings.payment_method?.forEach(async (user_payment_method, index) => {
                            if (user?.settings.payment_method?.length == index + 1) {
                                message_result += `${user_payment_method.text}`
                            } else {
                                message_result += `${user_payment_method.text}, `
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
                await ctx.wizard.selectStep(10)
                await UserService.get_ads(ctx)
                ctx.answerCbQuery('Мои объявления...')
            }

            if (data == 'back' || data == 'to_home') {
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

            if (data == 'continue') {
                return ctx.editMessageText('Выборк кошелька')
            }

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

                            // @ts-ignore
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

    static async single_ads(ctx: MyContext) {

        if (ctx.updateType == 'callback_query') {
            let callback_data = ctx.update["callback_query"].data
            
            if (callback_data == 'see_responses') {
                
                let user = await UserService.GetUserById(ctx)
                if (user?.middleware?.opened_ads) {

                    let ads = await this.get_created_ads(user?.middleware?.opened_ads)
                    
                    if (ads) {
                        // @ts-ignore
                        if (ads.responses.length == 0) {
                            ctx.answerCbQuery("Отликов нет!")
                        } else {
                            // @ts-ignore
                            console.log(ads.responses)
                        }
                    }
                
                    // await this.delete_ads(ctx, user?.middleware?.opened_ads)
                    // await this.unset_ads_id(ctx)
                    
                }

            }

            // Удаление объявления
            if (callback_data == 'delete') {
                // ctx.wizard.selectStep(10)
                // await UserService.get_ads(ctx)
                
                let user = await UserService.GetUserById(ctx)
                if (user?.middleware?.opened_ads) {
                    await this.delete_ads(ctx, user?.middleware?.opened_ads)
                    await this.unset_ads_id(ctx)
                }
                ctx.wizard.selectStep(10)
                await UserService.get_ads(ctx)
            }


            if (callback_data == 'back') {
                ctx.wizard.selectStep(10)
                await UserService.get_ads(ctx)
            }

        }

    }

    static async render_single_ads(ctx: MyContext, data: any) {
        ctx.wizard.selectStep(11)
        let message = `Объявление ${data._id}\n\n`
        message += `Количество откликов: ${data.responses.length}\n`
        message += `Cумма: ${data.sum}\n`
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
                            text: 'Просмотреть отлики',
                            callback_data: 'see_responses'
                        }
                    ],
                    [
                        {
                            text: 'Удалить объявление',
                            callback_data: 'delete'
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

    static async render(ctx: MyContext) {
        return await UserService.GetUserById(ctx)
            .then(async (document) => {
                if (document) {
                    let result = await UserService.CreateAds(ctx, document)
                    let item = result[0]
                    await UserService.GetCreatedADS(new ObjectId(item._id)).then(async (created_document: any) => {
                        if (created_document) {
                            let message = `<b>Объявление опубликовано!</b>\n`
                            message += `<b>Объём сделки: ${created_document.sum} ₽</b>\n`
                            // @ts-ignore
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
                        } else {
                            await ctx.answerCbQuery('Повторите попытку')
                        }
                    })


                }
            })
    }

    static async select_page(ctx: MyContext) {
        try {
            if (ctx.updateType == 'callback_query') {
                let callback_data = ctx.update['callback_query'].data
                let split = callback_data.split(' ')

                if (split[0] == 'goto') {
                    ctx.answerCbQuery()
                    await UserService.get_ads(ctx, parseFloat(split[1]) + 1)
                }

                if (callback_data == 'to_home') {
                    // await ctx.deleteMessage(ctx.update["callback_query"].message.message_id - 1)
                    await CustomerService.greeting(ctx)
                }

            }

            if (ctx.updateType == 'message') {

                let message = ctx.update["message"].text
                await UserService.GetCreatedADS(new ObjectId(message))
                    .then(async (result) => {
                        if (result) {
                            console.log('123')
                            await this.save_ads_id(ctx, new ObjectId(message))
                            await this.render_single_ads(ctx, result)
                        } else {
                            await UserService.get_ads(ctx)
                        }
                    }).catch(async (err) => {
                        await UserService.get_ads(ctx)
                    })

            }


        } catch (err) {
            await UserService.get_ads(ctx)
        }
    }

    static async save_ads_id(ctx: MyContext, id: ObjectId) {
        try {
            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $set: {
                    "middleware.opened_ads": id
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async unset_ads_id(ctx: MyContext) {
        try {
            await UserModel.findOneAndUpdate({
                id: ctx.from?.id
            }, {
                $unset: {
                    "middleware.opened_ads": ""
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async delete_ads(ctx: MyContext, id: ObjectId) {
        try {
            await ADSModel.findOneAndDelete({
                _id: id
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async get_created_ads(id: ObjectId) {
        try {
            return await ADSModel.findOne({
                _id: id
            }).then((doc) => { return doc }).catch(() => { return false })
        } catch (err) {
            return false
        }
    }
}