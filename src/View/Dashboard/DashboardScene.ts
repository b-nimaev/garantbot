import { Composer, Scenes } from "telegraf";
import { getUser, lose_coins } from "../../Controller/UserController";
import { MyContext } from "../../Model/Model";
require("dotenv").config()

async function greeting(ctx) {
    let user = await getUser(ctx.from)

    let balance

    if (user) {
        if (user.balance) {
            balance = user.balance
        } else {
            balance = 0
        }
    } else {
        balance = 0
    }

    const message = "<b>Ценные трофей (за IQ Coins)</b> \n\n1. Участие в розыгрыше $1000 на реальный счет в IQ option - 22000 коинов \n2. Консультация с аккаунт менеджером при депо от $1000 - 20000 коинов \n3. Стратегия 1 для торговли 3000 коинов \n4. Стратегия 2 для торговли 3000 коинов \n5. Стратегия 3 для торговли 3000 коинов \n\n<b>Ваш баланс " + balance + " IQ Coins \n\nВыберите необходимый пункт</b> \nЧтобы вернуться на главную, отправьте /back"
    const extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: '1', callback_data: '1' },
                { text: '2', callback_data: '2' }],
                [{ text: '3', callback_data: '3' },
                { text: '4', callback_data: '4' },
                { text: '5', callback_data: '5' }],
                [{ text: 'Назад', callback_data: 'back' }]
            ]
        }
    }

    // @ts-ignore
    ctx.reply(message, extra)
}

const handler = new Composer<MyContext>();
const dashboard = new Scenes.WizardScene(
    "trophies",
    handler,
);

handler.hears("/back", async (ctx) => {
    // ctx.scene.enter("registration")
    ctx.scene.enter('home')
    // ctx.answerCbQuery()
})

handler.action("back", async (ctx) => {
    // ctx.scene.enter("registration")
    ctx.scene.enter('home')
    ctx.answerCbQuery()
})

dashboard.action("home", async (ctx) => {
    ctx.scene.enter("home")
    ctx.answerCbQuery()
})

handler.action("contact", async (ctx) => {
    ctx.wizard.next()
    ctx.editMessageText("Отправьте сообщение, администрация ответит в ближайшее время")
    ctx.answerCbQuery()
})

dashboard.enter(async (ctx) => await greeting(ctx))

async function getBalance(ctx) {
    let user = await getUser(ctx.from)

    let balance: number

    if (user) {
        if (user.balance) {
            balance = user.balance
        } else {
            balance = 0
        }
    } else {
        balance = 0
    }

    return balance
}

handler.action('1', async (ctx) => {
    let balance: number = await getBalance(ctx)

    if (balance > 22000) {
        await ctx.reply('Поздравляю, ты становишся участником розыгрыша $1000 на реальный счет в IQ option! За результатами розыгрыша ты можешь следить на сайте игры  qevagame.com')
        await lose_coins(ctx.from, 22000, false)
        // await greeting(ctx)
        ctx.answerCbQuery('Отличный выбор!')
    } else {
        const message2 = `К сожалению, тебе не хватает ${22000 - balance} коинов на участие в розыгрыше $1000 для реальной торговли, но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.`
        ctx.answerCbQuery(`Не хватает ${22000 - balance} коинов`)
        await ctx.reply(message2)
        // await greeting(ctx)
    }
})
handler.action('2', async (ctx) => {

    let balance: number = await getBalance(ctx)

    if (balance > 20000) {
        await ctx.reply("Отличный выбор! Я записала тебя на консультацию с Гуру торговли. Мне только нужно время проверить размер твоего депозита и я вернусь.")
        ctx.answerCbQuery('Отличный выбор!')
        await lose_coins(ctx.from, 20000, false)
    } else {
        await ctx.reply(`К сожалению, тебе не хватает ${20000 - balance} коинов на консультацию с аккаунт менеджером, но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов. И не забудь, что для сопровождения аккаунт менеджера на твоем счету должно быть не менее $1000`)
        ctx.answerCbQuery(`Не хватает ${20000 - balance} коинов`)
    }
})
handler.action('3', async (ctx) => {
    let balance: number = await getBalance(ctx)

    if (balance > 3000) {
        ctx.answerCbQuery('Отличный выбор!')
        await ctx.reply('Отличный выбор! Лови стратегию')
        await ctx.replyWithDocument({ source: './src/assets/Estrategia 1.pdf' })
        await lose_coins(ctx.from, 3000, false)
    } else {
        await ctx.reply(`К сожалению, тебе не хватает ${3000 - balance} коинов. Но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.`)
        ctx.answerCbQuery(`Не хватает ${3000 - balance} коинов`)
    }
})
handler.action('4', async (ctx) => {
    let balance: number = await getBalance(ctx)

    if (balance > 3000) {
        ctx.answerCbQuery('Отличный выбор!')
        await ctx.reply('Отличный выбор! Лови стратегию')
        await ctx.replyWithDocument({ source: './src/assets/Estrategia 2.pdf' })
        await lose_coins(ctx.from, 3000, false)
    } else {
        await ctx.reply(`К сожалению, тебе не хватает ${3000 - balance} коинов. Но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.`)
        ctx.answerCbQuery(`Не хватает ${3000 - balance} коинов`)
    }
})
handler.action('5', async (ctx) => {
    let balance: number = await getBalance(ctx)

    if (balance > 3000) {
        ctx.answerCbQuery('Отличный выбор!')
        await ctx.reply('Отличный выбор! Лови стратегию')
        await ctx.replyWithDocument({ source: './src/assets/Estrategia 3.pdf' })
        await lose_coins(ctx.from, 3000, false)
    } else {
        await ctx.reply(`К сожалению, тебе не хватает ${3000 - balance} коинов. Но это не беда, ты можешь заработать 10000 коинов всего лишь пополнив депозит. Нажимай на кнопку внизу а потом отправляй свой email на проверку. Я начислю тебе 10 000 коинов.`)
        ctx.answerCbQuery(`Не хватает ${3000 - balance} коинов`)
    }
})

dashboard.command("/start", async (ctx) => ctx.scene.enter("home"))
dashboard.command("/registration", async (ctx) => console.log(ctx))
dashboard.command("/game", async (ctx) => ctx.scene.enter("game"))

export default dashboard