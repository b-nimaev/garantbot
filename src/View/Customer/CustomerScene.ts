import { Composer, Scenes } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { banks, currency } from "../..";
import { UserService } from "../../Controller/db";
import { MyContext } from "../../Model/Model";
import { greeting } from "./CustomerGreeting";
require("dotenv").config();

async function selectCurrency(ctx: MyContext) {
    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {
        currency.forEach(async (element) => {
            if (element.callback_data == data) {
                let res = await UserService.SetCurrency(ctx, element).then(res => { console.log(res) }).catch((err) => { console.log(err) })
                return res
            }
        })
    }

    ctx.answerCbQuery()
}

async function renderSelectCurrency(ctx: MyContext, user) {
    let message = `Вам нужно указать валюту \n\nСписок указанных вами банков`
    // \n<i>Настройки можно менять в настройках профиля</i>`

    for (let i = 0; i < user.settings.banks.length; i++) {
        message += `\n${i + 1}. ${user.settings.banks[i].text}`
    }

    const renderSelectCurrencyKeyboard: ExtraEditMessageText = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'BTC',
                        callback_data: 'btc'
                    },
                    {
                        text: 'USDT',
                        callback_data: 'usdt'
                    }
                ]
            ]
        }
    }
    await ctx.editMessageText(message, renderSelectCurrencyKeyboard)
    // ctx.wizard.selectStep(
    return ctx.wizard.selectStep(ctx.scene.session.cursor + 2)
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

async function selectBank(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {
        banks.forEach(async (element) => {
            if (element.callback_data == data) {
                await UserService.SetBank(ctx, element).then(res => { console.log(res) }).catch((err) => { console.log(err) })
                let user = await UserService.GetUserById(ctx)
                await renderSelectCurrency(ctx, user)
            }
        })
    }

    ctx.answerCbQuery()
}

// Поиск сделок
async function searchDeal(ctx: MyContext) {

    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {

        // Получение данных пользователя
        let user = await UserService.GetUserById(ctx)

        if (data == 'searchDeal') {
            ctx.answerCbQuery()
            // Если пользовтель найден
            if (user) {
                // Если массив банков пуст, устанавливаем первичные значения
                if (user.settings.banks?.length == 0) {
                    await renderSearchDeal(ctx)
                } else if (user.settings.banks) {
                    if (user.settings.currency?.length !== 0) {
                        if (user.settings.currency) {
                            // await renderSelectCurrency(ctx, user)
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
                                                text: 'Изменить параметры поиска',
                                                callback_data: 'chagneSearchParams'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Начать поиск',
                                                callback_data: 'start_search'
                                            }
                                        ]
                                    ]
                                }
                            }

                            await ctx.editMessageText(message, extra)
                            // return ctx.scene.enter('search')
                        }
                    } else {
                        await renderSelectCurrency(ctx, user)
                    }
                }
            } else {
                // Если пользователя нет в базе данных
                ctx.scene.enter('home')
            }

        }

        if (data == 'start_search') {
            return ctx.scene.enter('search')
        }

        if (data == 'chagneSearchParams') {
            return ctx.scene.enter('chagneSearchParams')
        }

        if (data == 'setSettings') {
            // UserService.SetRole(ctx)
            const message = `Выберите банки, в которые можете получать оплату`

            let searchDealKeyboard: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: []
                }
            }

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
        }

        if (data == 'getStats') {
            ctx.answerCbQuery('Получение статистики')
        }

        if (data == 'support') {
            ctx.answerCbQuery('Техподдержка')
        }
    }
}

const handler = new Composer<MyContext>(); // function
const customer = new Scenes.WizardScene(
    "customer",
    handler,
    async (ctx) => searchDeal(ctx),
    async (ctx) => selectBank(ctx),
    async (ctx) => selectCurrency(ctx),
)

handler.action('searchDeal', async (ctx) => searchDeal(ctx))

customer.leave(async (ctx) => console.log("customer scene leave"))
customer.enter(async (ctx) => await greeting(ctx))
customer.start(async (ctx) => await greeting(ctx))
export default customer