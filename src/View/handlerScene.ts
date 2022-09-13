import { Composer, Scenes } from "telegraf";
import { MyContext } from "../Model/Model";
require("dotenv").config()

const handler = new Composer<MyContext>();
const _handler = new Scenes.WizardScene(
    "screenshoot",
    handler,
);

_handler.enter(async (ctx) => console.log('Ожидание скриншота'))
_handler.leave(async (ctx) => console.log('Выход Ожидание скриншота'))

_handler.action("home", async (ctx) => {
    ctx.scene.enter("home")
    ctx.answerCbQuery()
})

handler.action("contact", async (ctx) => {
    ctx.wizard.next()
    ctx.editMessageText("Отправьте сообщение, администрация ответит в ближайшее время /назад")
    ctx.answerCbQuery()
})
handler.hears("/back", async (ctx) => {
    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Зарегистрироваться',
                        callback_data: 'register',
                        url: 'https://iqoption.com/ru'
                    },
                    {
                        text: 'Я уже зарегистрирован',
                        callback_data: 'auth'
                    }
                ]
            ]
        }
    }
    // await ctx.deleteMessage(ctx.update['callback_query'].message.message_id).then(res => console.log(res))
    await ctx.reply("Предлагаю тебе получить твои первые игровые 10 000 IQCoins, они нужны будут для того чтобы открывать позиции в игре и зарабатывать еще больше монет, которые ты потом сможешь обменять на призы. Для их получения тебе нужно просто зарегистрироваться в IQ Option. Не беспокойся для регистрации тебе понадобиться минимум данных - твое имя и адрес электронной почты, никаких платежных данных и привязок карт. При регистрации ты получишь $10000 на свой демо счет, на них ты сможешь торговать на платформе, тренировать навык, а если они закончаться, то сможешь их бесплатно восполнить. Скорее переходи по ссылке внизу, регистрируйся, а потом возвращайся сюда и я дам тебе 10000 IQCoins.")
    // @ts-ignore
    await ctx.reply('Заходи на платформу нажимай кнопку "Регистрация" в верхнем правом углу.  Вводи свою электронную почту, придумай пароль и подтверди, что тебе есть 18 лет. Вот и всё!', extra)
    ctx.scene.enter("home")
})

handler.on("message", async (ctx) => {
    await ctx.reply("Лови свои первые 10000 IQCoins и добро пожаловать в игру! ;)")
    await ctx.replyWithSticker("CAACAgIAAxkBAAIKrGLwmAoW3iFfEPhcYdD3JnFA6DCqAAJXBAACP5XMCj6R_XixcB-qKQQ")
    await ctx.reply("Кстати, чтобы торговать бинарными опционами с телефона нужно специальное приложение IQ option Х.  Но если ты пользуешься веб версией то в ней уже есть нужный тебе инструмент. В меню есть специальная ссылка на приложение, устонавливай и возвращайся в игру :)")


    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard: [['Я заработал!', 'Я потерял :(']],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    }

    const message = 'Предлагаю не медлить и попробовать совершить свою первую сделку на демо счёте. \nВыбери актив: EUR / USD \nВыбери размер позиции: $100 \nВыбери время экспирации: 1 min \nВыбери выше или ниже.Посмотри это видео, в котором подробно рассказано как совершить сделку: Небойся ошибиться, это тренировочный счёт ;)'

    await ctx.replyWithVideo({ source: "./src/assets/6.mp4" })
    // @ts-ignore
    await ctx.reply(message, extra)
    ctx.scene.enter("registration")
})

handler.action(/.*/, async (ctx) => {
    ctx.answerCbQuery()
    ctx.answerCbQuery('Пришли скриншот')
    console.log('action')
})


export default _handler