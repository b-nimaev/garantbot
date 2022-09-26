import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { MyContext } from "../Model/Model";
import { renderSelectCurrency } from "../View/Customer/CustomerScene";
import { IUser, UserService } from "./db";

export class ContextService {

    static async GetFormattedTime(timestmap: number) {
        var date = new Date(timestmap);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        var day = date.getDate()
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        var month = months[date.getMonth()];
        var year = date.getFullYear()
        // Will display time in 10:30:23 format
        var formattedTime = day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        return formattedTime
    }

    static async spliceBankFromSettings(ctx: MyContext, field: { text: string, callback_data: string }) {
        try {
            let user: IUser | null | false = await UserService.GetUserById(ctx)

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

    static async selectBank(ctx: MyContext) {
        try {
            let query = ctx.update['callback_query']

            if (query.data == 'continue') {
                let user: IUser | null | false = await UserService.GetUserById(ctx)
                ctx.wizard.selectStep(3)
                await renderSelectCurrency(ctx)
            }

            let data = query.data.split(' ')
            let banks: { text: string, callback_data: string }[] = await UserService.GetBanks()

            if (query) {
                if (data && banks.length > 0) {
                    if (data[0] !== 'remove_bank') {
                        banks.forEach(async (element: { text: string, callback_data: string }) => {
                            if (element.callback_data == data[0]) {
                                await UserService.SetBank(ctx, element)
                                    .then(async res => { await ContextService.rerenderAfterSelectBank(ctx) })
                                    .catch((err) => { console.log(err) })
                            }
                        })
                    } else {
                        banks.forEach(async (element: { text: string, callback_data: string }) => {
                            if (element.callback_data == data[1]) {
                                await this.spliceBankFromSettings(ctx, element).then(async () => {
                                    await ContextService.rerenderAfterSelectBank(ctx)
                                })
                            }

                        })
                    }
                }
            }

            ctx.answerCbQuery()
        } catch (err) {
            console.log(err)
        }
    }

    static async rerenderAfterSelectBank(ctx: MyContext) {
        try {
            let user: IUser | null | false = await UserService.GetUserById(ctx)

            if (user) {
                let message = `Выберите банки, в которые можете получать оплату \nВыбранные банки: `

                // @ts-ignore
                for (let i = 0; i < user.settings.banks.length; i++) {
                    // @ts-ignore
                    message += `\n${i + 1}. ${user.settings.banks[i].text}`
                }

                let keyboard = await ContextService.renderSelectBankKeyboard(ctx)
                if (keyboard) {
                    await ctx.editMessageText(message, keyboard)
                } else {
                    ctx.scene.enter('home')
                }
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
            let user: IUser | null | false = await UserService.GetUserById(ctx)

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
                            let tempvar = item.text + ' (удалить)'
                            if ((item.callback_data === element.callback_data) && (tempvar !== item.text)) {
                                element.text += ' (удалить)'
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

                searchDealKeyboard.reply_markup?.inline_keyboard.push([
                    {
                        text: 'Продолжить',
                        callback_data: 'continue'
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

    static async ChangeSearchParams(ctx: MyContext) {
        try {

            if (ctx.from) {

                let user: IUser | null | false = await UserService.GetUserById(ctx)

                if (user) {
                    let message = `Ваш ID: <code>${user.id}</code> \nРоль: <code>${user.role}</code> \nВаш e-mail: <code>${user.email}</code>\n`;
                    message += `Дата регистрации: ${user.date.registered} \n\n`;

                    const buyerExtraKeyboard: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Открыть сделку',
                                        callback_data: 'openDeal'
                                    }
                                ]
                            ]
                        }
                    }

                }

            }


        } catch (error) {

        }
    }
}