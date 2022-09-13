import * as EmailValidator from 'email-validator';
import { addDeposit, addEmail, add_coins, getEmail } from "../../../Controller/UserController";
import { MyContext } from '../../../Model/Model';

async function EmailCheck(ctx: MyContext) {
    if (EmailValidator.validate(ctx.update['message'].text)) {
        await addEmail(ctx.from, ctx.update["message"].text)
        const extra = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Да, продолжаем',
                            callback_data: 'next',
                        },
                        {
                            text: 'Изменить',
                            callback_data: 'cancel'
                        }
                    ]
                ]
            }
        }

        // @ts-ignore
        await ctx.reply(`Проверьте правильность ввода e-mail ${ctx.update["message"].text}`, extra)
        ctx.wizard.next()
    } else {
        ctx.reply("e-mail не валидный, повторите снова")
    }
}

export default EmailCheck