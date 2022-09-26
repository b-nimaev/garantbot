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

async function selectCurrencyHandler(ctx: MyContext) {
    try {
        let query = ctx.update['callback_query']
        let data: string = query.data.split(' ')

        if (query) {

            if (data[0] == 'continue') {
                return await searchScreen(ctx)
            }

            if (data[0] == 'reset') {
                return await UserService.ResetSettings(ctx)
                    .then(success => { ctx.answerCbQuery('Настройки сброшены'); ctx.scene.enter("home") })
                    .catch(error => { console.log(error); return false })
            }

            if (data[0] !== 'remove_currency') {
                let currency = await CurrencyService.GetCryptoCurrenciesArray()
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
                let currency = await CurrencyService.GetCryptoCurrenciesArray()
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

                    let crypto = await CurrencyService.GetCryptoCurrenciesArray()
                    let temp: InlineKeyboardButton[] = []
                    crypto.forEach((currency: ICurrency, index) => {
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
    let message = 'Выбранные банки: '
    for (let i = 0; i < user.settings.banks.length; i++) {
        message += `\n${i + 1}. ${user.settings.banks[i].text}`
    }

    message += '\nВыбранные валюты: '
    for (let i = 0; i < user.settings.currency?.length; i++) {
        message += `\n${i + 1}. ${user.settings.currency[i].text}`
    }

    const extra: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Начать поиск',
                        callback_data: 'start_search'
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

        return await renderBeforeSearch(ctx, user)


    } else {
        // Если пользователя нет в базе данных
        ctx.scene.enter('home')
    }
}

async function searchScreen(ctx: MyContext) {
    try {
        let user: IUser | null | false = await UserService.GetUserById(ctx)

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
    } catch (err) {
        ctx.scene.enter("home")
    }
}

// Поиск сделок
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
            ctx.answerCbQuery()

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
)

handler.action('searchDeal', async (ctx) => searchDeal(ctx))
// handler.action('back', async (ctx) => ctx.scene.enter('customer'))
customer.leave(async (ctx) => console.log("customer scene leave"))
customer.enter(async (ctx) => await greeting(ctx))
customer.start(async (ctx) => ctx.scene.enter('home'))
export default customer