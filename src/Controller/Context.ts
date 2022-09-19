import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
import { MyContext } from "../Model/Model";
import { IUser, UserService } from "./db";

export class ContextService {

    static async spliceBankFromSettings(ctx: MyContext, field: { text: string, callback_data: string }) {
        try {
            let user: IUser | null | undefined = await UserService.GetUserById(ctx)

            if (user) {
                await UserService.SpliceBank(ctx, field)
                    .then(success => { return ctx.answerCbQuery('Элемент удален из базы данных') })
                    .catch(unsuccess => { return ctx.answerCbQuery('Не получилось удалить') })

                return this.rerenderAfterSelectBank(ctx)
            }

        } catch (err) {
            console.log(err)
        }
    }

    static async selectBank(ctx: MyContext) {
        try {
            let query = ctx.update['callback_query']
            let data = query.data.split(' ')
            let banks: any = await UserService.GetBanks().then((response) => {
                return response[0].data
            })

            if (query) {
                if (data && banks.length > 0) {
                    if (data[0] !== 'remove_bank') {
                        banks.forEach(async (element: any) => {
                            if (element.callback_data == data[0]) {
                                await UserService.SetBank(ctx, element).then(res => { console.log(res) }).catch((err) => { console.log(err) })
                            }
                        })
                        await ContextService.rerenderAfterSelectBank(ctx)
                    } else {
                        banks.forEach(async (element: any) => {
                            if (element.callback_data == data[1]) {
                                await this.spliceBankFromSettings(ctx, element)
                                await this.rerenderAfterSelectBank(ctx)
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
            let user: IUser | null | undefined = await UserService.GetUserById(ctx)

            if (user) {
                if (user.settings.banks?.length !== 0) {
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
            let user: IUser | null | undefined = await UserService.GetUserById(ctx)

            if (user) {
                let banks: any = await UserService.GetBanks().then((response) => {
                    return response[0].data
                })

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

                let user: IUser | null | undefined = await UserService.GetUserById(ctx)

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