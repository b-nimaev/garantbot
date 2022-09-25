import { Composer, Scenes } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { currency } from "../..";
import { ContextService } from "../../Controller/Context";
import { IUser, UserService } from "../../Controller/db";
import { MyContext } from "../../Model/Model";
import { greeting } from "./CustomerGreeting";
require("dotenv").config();
async function selectCurrency(ctx: MyContext) {
    let query = ctx.update['callback_query']
    let data = query.data

    if (query) {

        if (data == 'reset') {
            return await UserService.ResetSettings(ctx)
                .then(success => { ctx.answerCbQuery('Настройки сброшены'); ctx.scene.enter("home") })
                .catch(error => { console.log(error); return false })
        }

        currency.forEach(async (element) => {
            if (element.callback_data == data) {
                let res = await UserService.SetCurrency(ctx, element).then(res => { console.log(res) }).catch((err) => { console.log(err) })
                return res
            }
        })
    }

    ctx.answerCbQuery()
}

export async function renderSelectCurrency(ctx: MyContext, user) {
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
                ],
                [
                    {
                        text: 'Сбросить настройки',
                        callback_data: 'reset'
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

export async function renderSearchD(ctx: MyContext) {
    // Если пользовтель найден
    let user = await UserService.GetUserById(ctx)
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

                    await ctx.editMessageText(message, extra)
                    // return ctx.scene.enter('search')
                }
            } else {
                renderSelectCurrency(ctx, user)
            }
        }
    } else {
        // Если пользователя нет в базе данных
        ctx.scene.enter('home')
    }
}

async function searchScreen(ctx: MyContext) {
    let user: IUser | null | undefined = await UserService.GetUserById(ctx)

    if (user) {
        let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>${user.role}</code> \nВаш e-mail: <code>${user.email}</code>\n`;

        var date = new Date(user.date.registered * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        console.log(formattedTime);

        message += `Дата регистрации: ${formattedTime} \n\n`;
        message += `Чтобы остановить поиск можно нажать на кнопку ниже <b>Остановить поиск</b>, \n\n<b>или</b> отправить команду /stop_search \n\n`
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
        ctx.answerCbQuery()
        // ctx.wizard.next()
    }
}

// Поиск сделок
async function searchDeal(ctx: MyContext) {

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

        if (data == 'chagneSearchParams') {
            return ctx.scene.enter('chagneSearchParams')
        }

        if (data == 'back') {
            return await greeting(ctx)
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
    async (ctx) => await ContextService.selectBank(ctx),
    async (ctx) => selectCurrency(ctx),
)

handler.action('searchDeal', async (ctx) => searchDeal(ctx))
// handler.action('back', async (ctx) => ctx.scene.enter('customer'))
customer.leave(async (ctx) => console.log("customer scene leave"))
customer.enter(async (ctx) => await greeting(ctx))
customer.start(async (ctx) => ctx.scene.enter('home'))
export default customer