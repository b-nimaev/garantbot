import { Composer, Scenes } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { ContextService } from "../../Controller/Context";
import { IUser, UserService } from "../../Controller/db";
import CurrencyService from "../../Controller/Services/Currecny.Services";
import { MyContext } from "../../Model/Model";
import ICurrency from "../../Model/Services.Currency.Model";
import { greeting } from "./CustomerGreeting";
require("dotenv").config();

async function SelectCryptoCurrency(ctx: MyContext) {
    // return createAndRenderAds(ctx)

    let crypto_currency = await CurrencyService.GetCryptoCurrenciesArray()
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

                // @ts-ignore
                // if (user.settings.crypto_currency) {
                //     // @ts-ignore
                //     user.settings.crypto_currency.forEach((element, index) => {
                //         let tempvar = element.text + ' (удалить)'
                //         if ((element.callback_data === currency.element.callback_data)) {
                //             currency.element.text += ' (удалить)'
                //             currency.element.callback_data = 'remove_currency ' + currency.element.callback_data
                //             // splice
                //             // return render
                //         }
                //     });
                // }

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

async function selectCurrencyHandler(ctx: MyContext) {
    try {
        let query = ctx.update['callback_query']
        let data: string = query.data.split(' ')

        if (query) {

            if (data[0] == 'continue') {
                return await SelectCryptoCurrency(ctx)
            }

            if (data[0] == 'reset') {
                return await UserService.ResetSettings(ctx)
                    .then(success => { ctx.answerCbQuery('Настройки сброшены'); ctx.scene.enter("home") })
                    .catch(error => { console.log(error); return false })
            }

            if (data[0] !== 'remove_currency') {
                let currency = await CurrencyService.GetAllCurrencies()
                currency.forEach(async (item) => {
                    if (item.element.callback_data == data[0]) {
                        await UserService.SetCurrency(ctx, item.element)
                            .then(async () => {
                                await ctx.answerCbQuery(data[0] + ' записан в бд')
                                return await renderSelectCurrency(ctx)
                            })
                    }
                })
                // console.log(data[0])
            }

            if (data[0] == 'remove_currency') {
                let currency = await CurrencyService.GetAllCurrencies()
                currency.forEach(async (item) => {
                    if (item.element.callback_data == data[1]) {
                        console.log(item.element.callback_data)
                        return await UserService.SpliceCurrency(ctx, item.element.callback_data)
                            .then(async () => {
                                await ctx.answerCbQuery(data[1] + ' удален из бд')
                                return await renderSelectCurrency(ctx)
                            })
                    }
                })
            }

        }
    } catch (err) {
        console.log(err)
    }
}

// Выбор валюты. 3 cursor
async function selectCurrency(ctx: MyContext) {

    ctx.updateType == 'message' ? ctx.scene.enter("home") : ''

    ctx.updateType == 'callback_query' ? await selectCurrencyHandler(ctx) : ''

}

export async function renderSelectCurrency(ctx: MyContext) {

    await UserService.GetUserById(ctx)
        .then(async user => {
            if (user) {
                if (user.settings) {
                    let message = `Список указанных вами банков:`

                    for (let i = 0; i < user.settings.banks.length; i++) {
                        message += `\n${i + 1}. ${user.settings.banks[i].text}`
                    }

                    message += `\n\nУкажите валюту:`
                    for (let i = 0; i < user.settings.currency?.length; i++) {
                        message += `\n${i + 1}. ${user.settings.currency[i].text}`
                    }

                    let renderSelectCurrencyKeyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    }

                    let currency = await CurrencyService.GetAllCurrencies()
                    let temp: InlineKeyboardButton[] = []
                    currency.forEach((currency: ICurrency, index) => {
                        user.settings.currency.forEach((element, index) => {
                            let tempvar = element.text + ' (удалить)'
                            if ((element.callback_data === currency.element.callback_data)) {
                                currency.element.text += ' (удалить)'
                                currency.element.callback_data = 'remove_currency ' + currency.element.callback_data
                                // splice
                                // return render
                            }
                        });

                        temp.push(currency.element)
                        if (index % 2 == 1) {
                            renderSelectCurrencyKeyboard.reply_markup?.inline_keyboard.push(temp)
                            temp = []
                        }

                    });

                    if (user.settings.currency.length > 0) {
                        // Добавление Кнопки сброса после рендера кнопок
                        renderSelectCurrencyKeyboard.reply_markup?.inline_keyboard.push([
                            {
                                text: 'Сбросить настройки',
                                callback_data: 'reset'
                            },
                            {
                                text: 'Продолжить',
                                callback_data: 'continue'
                            }
                        ])
                    }

                    // console.log(ctx)
                    await ctx.editMessageText(message, renderSelectCurrencyKeyboard).catch(async () => await ctx.reply(message, renderSelectCurrencyKeyboard))
                    ctx.wizard.selectStep(3)
                }
            }
        })
}

async function renderSearchDeal(ctx: MyContext) {
    const message = `Чтобы начать поиск, Вам нужно установить некоторые настройки. 
                    \n<i>Настройки можно менять в настройках профиля</i>`
    const searchDealKeyboard: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Продолжить',
                        callback_data: 'setSettings'
                    }
                ]
            ]
        }
    }
    await ctx.editMessageText(message, searchDealKeyboard)
}
async function renderBeforeSearch(ctx: MyContext, user: IUser) {
    let message = `<b>Настройка реквизитов для оплаты</b>\n`
    message += '<b>Выбранные банки:</b> '
    for (let i = 0; i < user.settings.banks.length; i++) {

        if (i == user.settings.banks.length - 1) {
            message += `<i>${user.settings.banks[i].text}</i>`
        } else {
            message += `<i>${user.settings.banks[i].text}, </i>`
        }

    }

    // message += '\nВыбранные фиатные валюты: '
    // for (let i = 0; i < user.settings.currency?.length; i++) {

    //     if (i == user.settings.currency.length - 1) {
    //         message += `<i>${user.settings.currency[i].text.toUpperCase()}</i>`
    //     } else {
    //         message += `<i>${user.settings.currency[i].text.toUpperCase()}, </i>`
    //     }

    // }

    // message += `\nДля приобретения таких криптовалют`

    const extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Указать криптовалюту',
                        callback_data: 'choose_crypto_currency'
                    }
                ],
                [
                    {
                        text: 'Назад',
                        callback_data: 'back'
                    },
                    {
                        text: 'Настройки',
                        callback_data: 'change'
                    }
                ]
            ]
        }
    }

    await ctx.editMessageText(message, extra)
    // return ctx.scene.enter('search')
}

export async function renderSearchD(ctx: MyContext) {

    // Если пользовтель найден
    let user = await UserService.GetUserById(ctx)

    if (user) {

        // Если массив банков пуст, устанавливаем первичные значения
        if (user.settings.banks.length == 0) {
            return await renderSearchDeal(ctx)
        }

        if (user.settings.currency.length == 0) {
            return await renderSelectCurrency(ctx)
        }

        if (user.settings.crypto_currency?.length == 0) {
            return await SelectCryptoCurrency(ctx)
        }

        return await renderBeforeSearch(ctx, user)


    } else {
        // Если пользователя нет в базе данных
        ctx.scene.enter('home')
    }
}

async function searchScreen(ctx: MyContext) {
    try {
        await UserService.GetUserById(ctx)
            .then(async (user) => {
                if (user) {
                    let timestmap = await ContextService.GetFormattedTime(user.date.registered)

                    let message = `Ваш ID: <code>${user.id}</code> \n`
                    message += `Роль: <code>${user.role}</code> \n`
                    message += `Ваш e-mail: <code>${user.email}</code>\n`
                    message += `Дата регистрации: ${timestmap} \n\n`
                    message += `Чтобы остановить поиск можно нажать на кнопку ниже <b>Остановить поиск</b>,`
                    message += `\n\n<b>или</b> отправить команду /stop_search \n\n`
                    message += `... Идёт поиск 🔎`;

                    const buyerExtraKeyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Остановить поиск',
                                        callback_data: 'stop_search'
                                    }
                                ]
                            ]
                        }
                    }

                    await ctx.editMessageText(message, buyerExtraKeyboard)
                    ctx.answerCbQuery('Поиск начат')
                    // ctx.wizard.next()
                }
            })

    } catch (err) {
        ctx.scene.enter("home")
    }
}

// Поиск сделок

async function indicate_the_amount(ctx) {
    try {
        await UserService.GetUserById(ctx)
            .then(async (user) => {

                if (user) {
                    // await UserService.CreateAds(ctx, user)

                    if (user.settings.crypto_currency) {
                        let message = `Отправьте необходимое количество ${user.settings.crypto_currency[0].text.toUpperCase()}`
                        await ctx.editMessageText(message)
                        ctx.answerCbQuery('Отправьте сумму')
                        ctx.wizard.selectStep(4)
                    }
                }

            })

    } catch (err) {
        console.log(err)
        return false
    }
}

async function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

async function renderMyAds(ctx: MyContext) {
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

async function searchDeal(ctx: MyContext) {

    if (ctx.updateType == 'message') {
        if (ctx.update["message"].text == "/stop_search") {
            return await searchScreen(ctx)
        }
    } else {

        let query = ctx.update['callback_query']
        let data = query.data

        if (query) {

            // // Получение данных пользователя

            if (data == 'my_ads') {
                await renderMyAds(ctx)
                ctx.answerCbQuery('Мои объявления...')
            }

            ctx.answerCbQuery()

            if (data == 'choose_crypto_currency') {
                return await SelectCryptoCurrency(ctx)
            }

            if (data == 'indicate_the_amount') {
                return await indicate_the_amount(ctx)
            }

            if (data == 'searchDeal') {
                return await renderSearchD(ctx)
            }

            if (data == 'start_search') {
                return await searchScreen(ctx)
            }

            if (data == 'stop_search') {
                return await renderSearchD(ctx)
            }

            if (data == 'change') {
                ctx.wizard.next()
                await ContextService.rerenderAfterSelectBank(ctx)
            }

            if (data == 'back') {
                return await greeting(ctx)
            }

            if (data == 'setSettings') {
                try {
                    // UserService.SetRole(ctx)
                    const message = `Выберите банки, в которые можете получать оплату`

                    let searchDealKeyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: []
                        }
                    }

                    let banks: { text: string, callback_data: string }[] = await UserService.GetBanks()
                    let temp: InlineKeyboardButton[] = []
                    banks.forEach(async (element, index) => {
                        temp.push(element)
                        if (index % 2 == 1) {
                            searchDealKeyboard.reply_markup?.inline_keyboard.push(temp)
                            temp = []
                        }

                        if (index == banks.length - 1) {
                            searchDealKeyboard.reply_markup?.inline_keyboard.push(temp)
                        }
                    })


                    ctx.editMessageText(message, searchDealKeyboard)
                    ctx.wizard.next()
                } catch (err) {
                    console.log(err)
                }
            }

            if (data == 'getStats') {
                ctx.answerCbQuery('Получение статистики')
            }

            if (data == 'support') {
                ctx.answerCbQuery('Техподдержка')
            }

        }

    }
}

const handler = new Composer<MyContext>(); // function
const customer = new Scenes.WizardScene(
    "customer",
    handler,
    async (ctx) => searchDeal(ctx),
    async (ctx) => await ContextService.selectBank(ctx),
    async (ctx) => selectCurrency(ctx),
    async (ctx) => checkSum(ctx),
    async (ctx) => await cryptoCurrencySelect(ctx)
)

async function cryptoCurrencySelect(ctx: MyContext) {
    if (ctx.updateType == 'callback_query') {
        let data = ctx.update["callback_query"].data
        let arr = await CurrencyService.GetCryptoCurrenciesArray()
        arr.forEach(async (currency) => {
            if (currency.element.callback_data == data) {
                await UserService.SetCryptoCurrency(ctx, currency.element)
                    .then(async () => {
                        await indicate_the_amount(ctx)
                    })
            }
        })
        await ctx.answerCbQuery(data + ' выбран')
    }
}


async function checkSum(ctx) {
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
                    // message_result += `\n<b>Оплата с помощью: </b>`

                    // user.settings.currency.forEach(async (item, index) => {
                    //     // @ts-ignore
                    //     if (index == user.settings.currency.length - 1) {
                    //         message_result += `${item.text.toUpperCase()}`
                    //     } else {
                    //         message_result += `${item.text.toUpperCase()}, `
                    //     }

                    // })

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
            return await createAndRenderAds(ctx)

        }

        if (data == 'my_ads') {
            await renderMyAds(ctx)
            ctx.answerCbQuery('Мои объявления...')
        }

        if (data == 'to_home') {
            console.log('to home')
            await greeting(ctx)
        }
    }
}
export async function createAndRenderAds(ctx: MyContext) {
    return await UserService.GetUserById(ctx)
        .then(async (document) => {
            if (document) {
                await UserService.CreateAds(ctx, document)
                    .then(async (created_document) => {
                        let message = `<b>Объявление опубликовано!</b>\n`
                        message += `<b>Объём сделки: <code>${created_document.sum} ${created_document.crypto_currency[0].text.toUpperCase()}</code></b>\n`
                        message += `<b>Идентификатор: </b><code>${created_document._id}</code>`
                        message += `\n<b>Валюта для оплаты: </b>`
                        created_document.currency.forEach(async (element, index) => {
                            if (index !== created_document.currency.length - 1) {
                                message += `<code><b>${element.text.toUpperCase()}</b></code>, `
                            } else {
                                message += `<code><b>${element.text.toUpperCase()}\n</b></code>`
                            }
                        });

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

handler.action('searchDeal', async (ctx) => searchDeal(ctx))
customer.leave(async (ctx) => console.log("customer scene leave"))
customer.enter(async (ctx) => await greeting(ctx))
customer.start(async (ctx) => ctx.scene.enter('home'))
export default customer