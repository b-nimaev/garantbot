import { Composer, Scenes } from "telegraf";
import { MyContext } from "../Model/Model";
import * as EmailValidator from 'email-validator';
import { addEmail } from "../Controller/UserController";

require("dotenv").config()

const handler = new Composer<MyContext>();
const mailset = new Scenes.WizardScene(
    "mailset",
    handler,
    async (ctx) => {
        if (ctx.update["callback_query"]) {
            await ctx.answerCbQuery()
            if (ctx.update["callback_query"].data == 'next') {
                ctx.scene.enter("home")
            }
            if (ctx.update["callback_query"].data == 'cancel') {
                const extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['На главную']],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                }

                // const message = 'Предлагаю не медлить и попробовать совершить свою первую сделку на демо счёте. \nВыбери актив: EUR / USD \nВыбери размер позиции: $100 \nВыбери время экспирации: 1 min \nВыбери выше или ниже.Посмотри это видео, в котором подробно рассказано как совершить сделку: Небойся ошибиться, это тренировочный счёт ;)'

                // await ctx.replyWithVideo({ source: "./src/assets/6.mp4" })
                // @ts-ignore
                await ctx.reply("Отправьте Ваш E-mail", extra)
                ctx.wizard.selectStep(ctx.session.__scenes.cursor - 1)
                // ctx.scene.enter("registration")
            }
        }
    }
);

mailset.enter(async (ctx) => console.log('Ожидание e-mail'))
mailset.leave(async (ctx) => console.log('Выход из ожидания e-mail'))

handler.on("message", async (ctx) => {
    if (ctx.update) {
        if (ctx.update["message"]) {
            // @ts-ignore
            if (ctx.update["message"].text == 'На главную') {
                ctx.scene.enter("home")
                // @ts-ignore
            } else if (EmailValidator.validate(ctx.update["message"].text)) {

                // @ts-ignore
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

    }
})

mailset.hears('/start', async (ctx) => ctx.scene.enter('home'))
mailset.hears('/register', async (ctx) => ctx.scene.enter('register'))
// mailset.hears('/start', async (ctx) => ctx.scene.enter('home'))

export default mailset