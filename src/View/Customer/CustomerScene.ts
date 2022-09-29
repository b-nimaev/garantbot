import { Composer, Scenes } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types";
import { ContextService } from "../../Controller/Context";
import { IUser, UserService } from "../../Controller/db";
import CurrencyService from "../../Controller/Services/Currecny.Services";
import { MyContext } from "../../Model/Model";
import ICurrency from "../../Model/Services.Currency.Model";
import { greeting } from "./CustomerGreeting";
import CustomerService, { AService, CCurrencies, SumService } from "./CustomerServices";
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

const handler = new Composer<MyContext>(); // function
const customer = new Scenes.WizardScene(
    "customer",
    handler,
    async (ctx) => await CustomerService.main(ctx),
    async (ctx) => await CustomerService.selectBank(ctx),
    async (ctx) => selectCurrency(ctx),
    async (ctx) => await SumService.checkSum(ctx),
    async (ctx) => await CCurrencies.handler(ctx),
    async (ctx) => await CustomerService.choosePaymentMethodHandler(ctx),
    async (ctx) => await CustomerService.check_wallet(ctx),
    async (ctx) => await CustomerService.select_exists_wallet(ctx),
    async (ctx) => {
        ctx.editMessageText('Укажите сумму')
    },
    async (ctx) => await AService.select_page(ctx)
)

handler.action('create', async (ctx) => await CustomerService.main(ctx))

customer.enter(async (ctx) => await greeting(ctx))
customer.start(async (ctx) => ctx.scene.enter('home'))
export default customer